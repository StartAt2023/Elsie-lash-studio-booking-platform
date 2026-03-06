# Elsie Lash Studio — Frontend

Next.js (App Router) + TypeScript + Tailwind CSS frontend for the eyelash studio booking platform.

## Required environment variables

Create `.env.local` from `.env.example`. All API URLs come from env (no hardcoded production URLs).

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | Yes (for API) | Backend API base URL. Local dev: `http://localhost:5001`. Production: your deployed backend URL. |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | For admin | Temporary admin login password (client-side; use a dev-only value until real auth exists). |

If `NEXT_PUBLIC_API_BASE_URL` is unset, the app falls back to `http://localhost:5001` for local development only.

## Running locally

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   ```bash
   cp .env.example .env.local
   ```

   Set `NEXT_PUBLIC_API_BASE_URL` to your backend URL (e.g. `http://localhost:5001` for local). Set `NEXT_PUBLIC_ADMIN_PASSWORD` to access `/admin` (after logging in at `/admin/login`).

3. **Start the dev server**

   ```bash
   npm run dev
   ```

   The app will be at [http://localhost:3000](http://localhost:3000).

## Frontend + backend together

Run both so the site and admin can call the API.

**Terminal 1 — backend (from repo root):**

```bash
cd Backend && npm install && npm run dev
```

Backend runs on port **5001** by default (set `PORT` in backend `.env` to change).

**Terminal 2 — frontend:**

```bash
cd Frontend && npm install && npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). Use `/admin/login` to access the admin area (Bookings, Calendar, Customers, Services, Gallery, Content, Settings).

## API integration

- **API client:** `lib/api.ts` — base URL via `getBaseUrl()` (from `NEXT_PUBLIC_API_BASE_URL`), typed GET/POST/PUT/DELETE helpers, and normalized errors (`ApiError`: `message`, `statusCode`).
- **Field names** match the backend exactly (e.g. `fullName`, `service`, `date` for bookings; `imageUrl` for gallery).
- **Date/time:** Australia/Sydney. No timezone conversion in the API.
- **Auth:** Not implemented; when the API adds it, set `apiConfig.getToken` in `lib/api.ts` so requests send `Authorization`.

See `Backend/API.md` for full endpoint and request/response details.
