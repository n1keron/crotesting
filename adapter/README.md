# CronosPRO read-only adapter

Initial adapter for a custom UI over the installed CronosPRO 6.4 web interface.

## Safety and current limits

- This is an experimental integration layer, not an official CronosPRO API.
- It submits requests to the configured CronosPRO web interface; it does not read database files directly.
- Search accepts only `FieldN` parameters. It intentionally does not forward edit/correction/delete/save form actions.
- Bind to localhost only. Do not expose this service to a LAN or the Internet without authentication, CSRF protection, session expiry, and a review of the upstream authentication flow.
- Sessions are held in process memory and are lost on restart.
- Login and HTML parsing need verification against the exact local CronosPRO configuration; the login endpoint reports the resulting page title but cannot guarantee authentication succeeded.

## Run on Windows

1. Set `CRONOS_BASE_URL` to the actual local CronosPRO web server URL, including port, for example `http://127.0.0.1:8080/`.
2. Create a virtual environment and install dependencies:

   ```powershell
   py -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r adapter\requirements.txt
   ```

3. Start the adapter from the repository root:

   ```powershell
   uvicorn adapter.main:app --host 127.0.0.1 --port 8765
   ```

4. Open http://127.0.0.1:8765/docs for the API schema.

## Endpoints

- `GET /health`
- `POST /api/session/login` — JSON: `{"username":"…","password":"…"}`
- `POST /api/search` — JSON: `{"working_directory":"…","fields":{"Field1":"…"}}`; send `X-Cronos-Session` with the session token if using the API directly.
- `GET /api/search/status?working_directory=…`
- `GET /api/record?working_directory=…&base=1&sysNum=1`
- `POST /api/session/logout`

The login/session contract is provisional and should be aligned with actual browser network traffic before relying on it. Do not commit passwords, cookies, session identifiers, or production database contents.
