from __future__ import annotations

import os
import secrets
from html import unescape
from typing import Any
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup
from fastapi import FastAPI, Header, HTTPException, Response
from pydantic import BaseModel, Field

CRONOS_BASE_URL = os.getenv("CRONOS_BASE_URL", "http://127.0.0.1:8080/").rstrip("/") + "/"
TIMEOUT = float(os.getenv("CRONOS_TIMEOUT", "20"))

app = FastAPI(title="CronosPRO read-only adapter", version="0.1.0")
_sessions: dict[str, requests.Session] = {}


class LoginRequest(BaseModel):
    username: str = Field(min_length=1, max_length=256)
    password: str = Field(min_length=1, max_length=1024)


class SearchRequest(BaseModel):
    working_directory: str = Field(min_length=1, max_length=2048)
    fields: dict[str, str] = Field(default_factory=dict)


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


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "adapter": "cronospro-readonly"}


@app.post("/api/session/login")
def login(body: LoginRequest, response: Response) -> dict[str, str]:
    session = requests.Session()
    # Fetch the login page first so the server can issue its normal cookies.
    page = cronos_request(session, "GET", "index.html")
    html = decode_html(page)
    soup = BeautifulSoup(html, "html.parser")
    form = soup.find("form")
    action = form.get("action", "CroInternal") if form else "CroInternal"
    payload: dict[str, str] = {}
    if form:
        for element in form.select('input[type="hidden"][name]'):
            payload[element["name"]] = element.get("value", "")
    payload.update({"Name": body.username, "Password": body.password})
    result = cronos_request(session, "POST", action, data=payload)
    result_html = decode_html(result)
    result_text = title_and_text(result_html)
    # Keep credentials and upstream cookies only in server memory.
    token = secrets.token_urlsafe(32)
    _sessions[token] = session
    response.set_cookie("cronos_adapter_session", token, httponly=True, samesite="strict")
    return {"status": "submitted", "page_title": result_text["title"], "message": "Проверьте, что CronosPRO открыл рабочую сессию."}


@app.post("/api/search")
def search(body: SearchRequest, cronos_adapter_session: str | None = Header(default=None, alias="X-Cronos-Session")) -> dict[str, Any]:
    session = get_session(cronos_adapter_session)
    # Strictly read-only: do not forward form actions associated with correction,
    # deletion, saving, cancellation, or other state-changing operations.
    payload = {"WorkingDirectory": body.working_directory, "SimpleFind": "Выполнить запрос"}
    for name, value in body.fields.items():
        if not name.startswith("Field") or not name[5:].isdigit():
            raise HTTPException(status_code=400, detail=f"Недопустимое поле поиска: {name}")
        payload[name] = value
    result = cronos_request(session, "POST", "CroInternal", data=payload)
    parsed = title_and_text(decode_html(result))
    return {"title": parsed["title"], "text": parsed["text"]}


@app.get("/api/search/status")
def search_status(working_directory: str, cronos_adapter_session: str | None = Header(default=None, alias="X-Cronos-Session")) -> dict[str, Any]:
    session = get_session(cronos_adapter_session)
    result = cronos_request(
        session, "GET", "CroInternal",
        params={"WorkingDirectory": working_directory, "Finding": "Поиск"},
    )
    parsed = title_and_text(decode_html(result))
    return {"title": parsed["title"], "text": parsed["text"]}


@app.get("/api/record")
def view_record(
    working_directory: str,
    base: str = "1",
    sys_num: str = Field(default="1", alias="sysNum"),
    cronos_adapter_session: str | None = Header(default=None, alias="X-Cronos-Session"),
) -> dict[str, Any]:
    session = get_session(cronos_adapter_session)
    result = cronos_request(
        session, "GET", "CroInternal",
        params={
            "WorkingDirectory": working_directory,
            "Base": base,
            "SysNum": sys_num,
            "Level": "0",
            "BeginRecord": "0",
            "ViewRecord": "View",
        },
    )
    parsed = title_and_text(decode_html(result))
    return {"title": parsed["title"], "text": parsed["text"]}


@app.post("/api/session/logout")
def logout(response: Response, cronos_adapter_session: str | None = Header(default=None, alias="X-Cronos-Session")) -> dict[str, str]:
    if cronos_adapter_session:
        session = _sessions.pop(cronos_adapter_session, None)
        if session:
            session.close()
    response.delete_cookie("cronos_adapter_session")
    return {"status": "ok"}
