# Deploy Checklist — Backend on Render, Frontend on Vercel

This file contains step-by-step deploy instructions, copy/paste environment variable examples, and local test commands.

## Overview
- Backend: deploy the `backend` folder as a Render Web Service.
- Frontend: deploy the root Vite app to Vercel.

## Backend — Render

1. Create a Render account and connect your Git repository.
2. Click New → Web Service.
3. Configure:
   - Name: `chat-backend` (or your choice)
   - Environment: `Node`
   - Branch: your branch (e.g. `main`)
   - Root Directory: `backend` (important)
   - Start Command: `npm start`
   - Build Command: leave empty or `npm install`
4. Add Environment Variables in the Render dashboard (Service → Environment):

```
MONGO_URI=your_mongo_connection_string
CLIENT_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

5. Deploy. Copy the service URL (e.g. `https://chat-backend.onrender.com`).

Notes:
- The `backend` code uses `process.env.PORT` and `process.env.CLIENT_URL` for CORS.
- Ensure your `MONGO_URI` allows connections from Render (no restrictive IP whitelists).

## Frontend — Vercel

1. Create a Vercel account and import the same Git repository.
2. When importing the project, set:
   - Root Directory: project root (where `package.json` and `vite.config.js` live)
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. In Vercel Project → Settings → Environment Variables, add:

```
VITE_API_URL=https://chat-backend.onrender.com
```

4. Deploy. Note the Vercel URL (e.g. `https://your-app.vercel.app`).

Notes:
- `VITE_` prefix is required for Vite to expose vars to the client.
- After Vercel deploys, update `CLIENT_URL` on Render to the exact Vercel domain.

## Local .env examples

- Backend (`backend/.env`):

```
MONGO_URI=mongodb+srv://user:pass@cluster.example.mongodb.net/dbname
CLIENT_URL=http://localhost:5173
```

- Frontend (`.env` or `.env.local` at project root):

```
VITE_API_URL=http://localhost:5000
```

## Local testing commands (PowerShell)

Start backend:
```powershell
cd backend
npm install
npm run dev
```

Start frontend (root):
```powershell
npm install
npm run dev
```

Build frontend for production (local preview):
```powershell
npm run build
npm run start
```

## Post-deploy checklist
- Verify the frontend can GET `VITE_API_URL/api/messages` in the browser/network tab.
- Confirm Render service logs show successful startup and MongoDB connection.
- If you see CORS errors, ensure `CLIENT_URL` exactly matches the frontend origin.

## Troubleshooting
- 502/504 on Vercel when calling API: check that the Render URL is `https` and healthy.
- Mongo connection errors: check credentials and network access.
- API returns 404: confirm `ROOT DIRECTORY` for Render was set to `backend` and start command `npm start`.

---
File: [DEPLOY.md](DEPLOY.md)
