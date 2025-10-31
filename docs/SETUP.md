# Setup & Run

This file explains how to run the project locally (Windows PowerShell instructions).

Prerequisites:
- Node.js (v18+ recommended) and npm installed
- Git (optional, for cloning)

Install dependencies:

```powershell
cd d:\Web\ProjectEtec2
npm install
```

Run the app (dev):

The `dev` script runs Vite and json-server concurrently. It expects `db.json` in the repository root.

```powershell
npm run dev
```

What the `dev` script does:
- Starts the Vite dev server (default port 5173)
- Starts json-server and watches `db.json` on port 3000

If you prefer to run servers separately:

```powershell
# start json-server
npm run server

# in another terminal, start vite
npm run dev # (or npx vite)
```

Access:
- Frontend: http://localhost:5173
- Mock API: http://localhost:3000

Notes:
- If ports are in use, you can pass Vite a custom port:

```powershell
npx vite --port 5174
```

- json-server will write changes to `db.json`; create backups if you need a pristine dataset.

Troubleshooting:
- If fetching products fails, ensure json-server is running and accessible at port 3000.
- If CORS issues occur, json-server is usually permissive; otherwise inspect browser console for details.

