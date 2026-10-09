from __future__ import annotations

import os
import re
import secrets
from typing import Any
from urllib.parse import urlencode, urljoin

import requests
from bs4 import BeautifulSoup
from fastapi import FastAPI, HTTPException, Query, Request, Response
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

CRONOS_BASE_URL = os.getenv("CRONOS_BASE_URL", "http://127.0.0.1:80/").rstrip("/") + "/"
TIMEOUT = float(os.getenv("CRONOS_TIMEOUT", "20"))

app = FastAPI(title="CronosPRO read-only adapter", version="0.1.0")
_sessions: dict[str, requests.Session] = {}


class LoginRequest(BaseModel):
    username: str = Field(min_length=1, max_length=256)
    password: str = Field(default="", max_length=1024)


class SearchRequest(BaseModel):
    working_directory: str = Field(min_length=1, max_length=2048)
    fields: dict[str, str] = Field(default_factory=dict)


class SelectBankRequest(BaseModel):
    working_directory: str = Field(min_length=1, max_length=2048)
    bank: str = Field(min_length=1, max_length=256)


class SelectBaseRequest(BaseModel):
    working_directory: str = Field(min_length=1, max_length=2048)
    base: str = Field(min_length=1, max_length=256)
    request_type: str = Field(default="Simple", pattern="^(Simple|Complex|Input)$")
    view_rows: int = Field(default=20, ge=1, le=500)


def get_session(token: str | None) -> requests.Session:
    if not token or token not in _sessions:
        raise HTTPException(status_code=401, detail="Сначала выполните вход в CronosPRO")
    return _sessions[token]


def cronos_request(session: requests.Session, method: str, path: str = "CroInternal", **kwargs: Any) -> requests.Response:
    url = urljoin(CRONOS_BASE_URL, path)
    try:
        result = session.request(method, url, timeout=TIMEOUT, **kwargs)
        result.raise_for_status()
        return result
    except requests.RequestException as exc:
        raise HTTPException(status_code=502, detail="Не удалось связаться с веб-интерфейсом CronosPRO") from exc


def decode_html(response: requests.Response) -> str:
    # The legacy interface may serve Windows-1251 without a reliable charset header.
    response.encoding = response.apparent_encoding or "cp1251"
    return response.text


def title_and_text(html: str) -> dict[str, str]:
    soup = BeautifulSoup(html, "html.parser")
    return {
        "title": soup.title.get_text(" ", strip=True) if soup.title else "",
        "text": soup.get_text("\n", strip=True),
    }


@app.get("/", include_in_schema=False)
def ui() -> FileResponse:
    return FileResponse(os.path.join(os.path.dirname(__file__), "ui.html"), media_type="text/html; charset=utf-8")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "adapter": "cronospro-readonly"}


@app.post("/api/session/login")
def login(body: LoginRequest, response: Response) -> dict[str, Any]:
    session = requests.Session()
    # Fetch the login page first so the server can issue its normal cookies.
    page = cronos_request(session, "GET", "index.html")
    html = decode_html(page)
    soup = BeautifulSoup(html, "html.parser")
    form = soup.find("form")
    action = form.get("action", "CroInternal") if form else "CroInternal"
    payload: dict[str, str] = {}
    if form:
        # Submit the successful controls from the actual legacy login form.
        # UserId is a regular text input (not hidden), and Login is the submit
        # button; both may be required by CroInternal.
        for element in form.select("input[name]"):
            input_type = (element.get("type") or "text").lower()
            if input_type == "reset" or input_type == "button":
                continue
            if input_type == "submit" and element.get("name") != "Login":
                continue
            payload[element["name"]] = element.get("value", "")
    payload.update({"Name": body.username, "Password": body.password})
    # CronosPRO's bundled HTML declares Windows-1251. requests' normal dict
    # encoding uses UTF-8, so explicitly form-encode using the legacy charset.
    encoded_payload = urlencode(payload, encoding="cp1251", errors="replace").encode("ascii")
    result = cronos_request(
        session,
        "POST",
        action,
        data=encoded_payload,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    result_html = decode_html(result)
    result_text = title_and_text(result_html)
    combined = (result_text["title"] + "\\n" + result_text["text"]).casefold()
    if "не опознаны имя пользователя или пароль" in combined:
        session.close()
        return {
            "status": "rejected",
            "page_title": result_text["title"],
            "message": "CronosPRO отверг имя пользователя или пароль; рабочая сессия не создана.",
        }
    # Only retain a session when the returned page did not report a login error.
    token = secrets.token_urlsafe(32)
    _sessions[token] = session
    response.set_cookie("cronos_adapter_session", token, httponly=True, samesite="strict")
    result_soup = BeautifulSoup(result_html, "html.parser")
    working_directory = next(
        (el.get("value", "") for el in result_soup.select('input[name="WorkingDirectory"]') if el.get("value")),
        "",
    )
    banks = [
        {"value": option.get("value", ""), "label": option.get_text(" ", strip=True)}
        for option in result_soup.select('select[name="Bank"] option')
        if option.get("value")
    ]
    return {
        "status": "submitted",
        "page_title": result_text["title"],
        "working_directory": working_directory,
        "banks": banks,
        "message": "Форма отправлена. Если показан экран выбора банка, выберите банк перед поиском.",
    }


@app.post("/api/session/select-bank")
def select_bank(body: SelectBankRequest, request: Request) -> dict[str, Any]:
    session = get_session(request.cookies.get("cronos_adapter_session"))
    payload = {
        "WorkingDirectory": body.working_directory,
        "Bank": body.bank,
        "BankSelect": "Выбрать банк",
    }
    encoded_payload = urlencode(payload, encoding="cp1251", errors="replace").encode("ascii")
    result = cronos_request(
        session,
        "POST",
        "CroInternal",
        data=encoded_payload,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    html = decode_html(result)
    parsed = title_and_text(html)
    soup = BeautifulSoup(html, "html.parser")
    working_directory = next(
        (el.get("value", "") for el in soup.select('input[name="WorkingDirectory"]') if el.get("value")),
        body.working_directory,
    )
    return {
        "title": parsed["title"],
        "text": parsed["text"],
        "working_directory": working_directory,
    }


@app.get("/api/session/base-options")
def base_options(request: Request, working_directory: str = Query(min_length=1, max_length=2048)) -> dict[str, Any]:
    session = get_session(request.cookies.get("cronos_adapter_session"))
    payload = {"WorkingDirectory": working_directory, "SelectBase": "Выбор базы/запроса по образцу"}
    encoded_payload = urlencode(payload, encoding="cp1251", errors="replace").encode("ascii")
    result = cronos_request(session, "POST", "CroInternal", data=encoded_payload, headers={"Content-Type": "application/x-www-form-urlencoded"})
    html = decode_html(result)
    parsed = title_and_text(html)
    soup = BeautifulSoup(html, "html.parser")
    directory = next((el.get("value", "") for el in soup.select('input[name="WorkingDirectory"]') if el.get("value")), working_directory)
    bases = [{"value": o.get("value", ""), "label": o.get_text(" ", strip=True)} for o in soup.select('select[name="Base"] option') if o.get("value")]
    requests_list = [{"value": o.get("value", ""), "label": o.get_text(" ", strip=True)} for o in soup.select('select[name="QBE"] option') if o.get("value")]
    return {"title": parsed["title"], "text": parsed["text"], "working_directory": directory, "bases": bases, "sample_requests": requests_list}



def cronos_field_label(element: Any) -> str:
    """Resolve the human-readable caption for a CronosPRO search control."""
    name = element.get("name", "")
    # Explicit HTML labels and accessible captions are the most reliable source.
    explicit = element.get("aria-label") or element.get("title")
    if explicit and explicit.strip():
        return explicit.strip()
    form = element.find_parent("form")
    label = form.find("label", attrs={"for": name}) if form else None
    if label:
        text = label.get_text(" ", strip=True)
        if text:
            return text

    row = element.find_parent("tr")
    if row:
        cells = row.find_all(["td", "th"], recursive=False)
        current_cell = element.find_parent(["td", "th"])
        if current_cell in cells:
            index = cells.index(current_cell)
            # Walk from the closest preceding cell outward; ignore technical IDs.
            for cell in reversed(cells[:index]):
                text = cell.get_text(" ", strip=True).strip(" :：\t\r\n")
                if text and not re.fullmatch(r"Field\d+", text, flags=re.I):
                    return text
        # Some CronosPRO templates put the caption and input in the same cell.
        cell_text = current_cell.get_text(" ", strip=True) if current_cell else ""
        for candidate in (cell_text, row.get_text(" ", strip=True)):
            candidate = candidate.strip(" :：\t\r\n")
            if candidate and candidate != name and not re.fullmatch(r"Field\d+", candidate, flags=re.I):
                return candidate

    previous = element.find_previous(string=True)
    if previous:
        text = str(previous).strip(" :：\t\r\n")
        if text and text != name and not re.fullmatch(r"Field\d+", text, flags=re.I):
            return text
    return name

@app.post("/api/session/choose-base")
def choose_base(body: SelectBaseRequest, request: Request) -> dict[str, Any]:
    session = get_session(request.cookies.get("cronos_adapter_session"))
    payload = {"WorkingDirectory": body.working_directory, "Base": body.base, "ReqType": body.request_type, "ViewRows": str(body.view_rows), "BaseSelect": "Выбрать базу"}
    encoded_payload = urlencode(payload, encoding="cp1251", errors="replace").encode("ascii")
    result = cronos_request(session, "POST", "CroInternal", data=encoded_payload, headers={"Content-Type": "application/x-www-form-urlencoded"})
    html = decode_html(result)
    parsed = title_and_text(html)
    soup = BeautifulSoup(html, "html.parser")
    directory = next((el.get("value", "") for el in soup.select('input[name="WorkingDirectory"]') if el.get("value")), body.working_directory)
    fields = [{"name": el.get("name", ""), "type": el.get("type", "text"), "value": el.get("value", ""), "label": cronos_field_label(el)} for el in soup.select('input[name^="Field"], select[name^="Field"]')]
    return {"title": parsed["title"], "text": parsed["text"], "working_directory": directory, "fields": fields, "base_selected": bool(soup.select('input[name="SimpleFind"]'))}


@app.post("/api/search")
def search(body: SearchRequest, request: Request) -> dict[str, Any]:
    session = get_session(request.cookies.get("cronos_adapter_session"))
    # Strictly read-only: do not forward form actions associated with correction,
    # deletion, saving, cancellation, or other state-changing operations.
    payload = {"WorkingDirectory": body.working_directory, "SimpleFind": "Выполнить запрос"}
    for name, value in body.fields.items():
        if not name.startswith("Field") or not name[5:].isdigit():
            raise HTTPException(status_code=400, detail=f"Недопустимое поле поиска: {name}")
        payload[name] = value
    encoded_payload = urlencode(payload, encoding="cp1251", errors="replace").encode("ascii")
    result = cronos_request(
        session, "POST", "CroInternal", data=encoded_payload,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    parsed = title_and_text(decode_html(result))
    return {"title": parsed["title"], "text": parsed["text"]}


class PreviewRequest(BaseModel):
    working_directory: str = Field(min_length=1, max_length=2048)
    view_rows: int = Field(default=1000, ge=1, le=5000)


@app.post("/api/search/preview")
def preview_search(body: PreviewRequest, request: Request) -> dict[str, Any]:
    """Open CronosPRO's read-only result-list view for the current selection."""
    session = get_session(request.cookies.get("cronos_adapter_session"))
    payload = {
        "WorkingDirectory": body.working_directory,
        "ViewRows": str(body.view_rows),
        "PreView": "Просмотр",
    }
    encoded_payload = urlencode(payload, encoding="cp1251", errors="replace").encode("ascii")
    result = cronos_request(
        session, "POST", "CroInternal", data=encoded_payload,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    html = decode_html(result)
    soup = BeautifulSoup(html, "html.parser")
    parsed = title_and_text(html)
    records: list[dict[str, str]] = []
    for link in soup.select("a[href]"):
        href = link.get("href", "")
        label = link.get_text(" ", strip=True)
        if not label:
            continue
        # Only surface navigation links that appear to identify a record.
        from urllib.parse import parse_qs, urlparse
        params = parse_qs(urlparse(href).query)
        sys_num = (params.get("SysNum") or params.get("sysNum") or [None])[0]
        if sys_num:
            records.append({"label": label, "sys_num": sys_num})
    directory = next(
        (el.get("value", "") for el in soup.select('input[name="WorkingDirectory"]') if el.get("value")),
        body.working_directory,
    )
    # CronosPRO often reports the total selection count in the page text,
    # which may be larger than the number of record links rendered in this view.
    count_match = re.search(r"Отобрано\s+записей\s*[:№]?\s*(\d+)", parsed["text"], flags=re.IGNORECASE)
    total_records = int(count_match.group(1)) if count_match else len(records)
    return {
        "title": parsed["title"],
        "text": parsed["text"],
        "working_directory": directory,
        "records": records,
        "total_records": total_records,
    }


@app.get("/api/search/status")
def search_status(working_directory: str, request: Request) -> dict[str, Any]:
    session = get_session(request.cookies.get("cronos_adapter_session"))
    result = cronos_request(
        session, "GET", "CroInternal",
        params={"WorkingDirectory": working_directory, "Finding": "Поиск"},
    )
    parsed = title_and_text(decode_html(result))
    return {"title": parsed["title"], "text": parsed["text"]}


@app.get("/api/record")
def view_record(
    request: Request,
    working_directory: str,
    base: str = "1",
    sys_num: str = Query(default="1", alias="sysNum"),
) -> dict[str, Any]:
    session = get_session(request.cookies.get("cronos_adapter_session"))
    result = cronos_request(
        session, "GET", "CroInternal",
        params={
            "WorkingDirectory": working_directory,
            "Base": base,
            "SysNum": sys_num,
            "DeleteFiles": "1",
            "Level": "0",
            "BeginRecord": "0",
            "ViewRecord": "View",
        },
    )
    html = decode_html(result)
    parsed = title_and_text(html)
    soup = BeautifulSoup(html, "html.parser")
    fields: list[dict[str, str]] = []
    for row in soup.select("table tr"):
        cells = row.find_all(["td", "th"], recursive=False)
        if len(cells) < 2:
            continue
        label = cells[0].get_text(" ", strip=True).rstrip(":")
        value = " | ".join(cell.get_text(" ", strip=True) for cell in cells[1:])
        if label and value and label != value:
            fields.append({"label": label, "value": value})
    return {"title": parsed["title"], "text": parsed["text"], "fields": fields}


@app.post("/api/session/logout")
def logout(request: Request, response: Response) -> dict[str, str]:
    token = request.cookies.get("cronos_adapter_session")
    if token:
        session = _sessions.pop(token, None)
        if session:
            session.close()
    response.delete_cookie("cronos_adapter_session")
    return {"status": "ok"}
