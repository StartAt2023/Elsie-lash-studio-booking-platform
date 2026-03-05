# Elsie Lash Studio — Frontend

Next.js (App Router) + TypeScript + Tailwind CSS frontend for the eyelash studio booking platform.

## Running locally

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env.local` and set the API base URL if needed:

   ```bash
   cp .env.example .env.local
   ```

   Default: `NEXT_PUBLIC_API_BASE_URL=http://localhost:5001` (used when unset).

3. **Start the dev server**

   ```bash
   npm run dev
   ```

   The app will be at [http://localhost:3000](http://localhost:3000).

## Frontend + backend together

- **Backend** (Express API): run from the `Backend` (or `backend`) folder on port **5001** (see backend docs).
- **Frontend** (this app): run from this folder; it calls the API using `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:5001`).

**Quick start (two terminals):**

```bash
# Terminal 1 — backend
cd Backend && npm run dev

# Terminal 2 — frontend
cd Frontend && npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). Ensure the backend is up so that Services, Booking, and Gallery work (they call `/api/services`, `/api/bookings`, `/api/gallery`).

## API integration

- **API client:** `lib/api.ts` — base URL, typed helpers (`getServices`, `createBooking`, `getGallery`), and normalized errors (`ApiError`: `message`, `statusCode`).
- **Field names** match the backend exactly (e.g. `fullName`, `service`, `date` for bookings; `imageUrl` → mapped to `src` for gallery images).
- **Date/time:** Assumed Australia/Sydney; the UI does not convert timezones.
- **Auth:** No auth yet; when the API adds it, add an `Authorization` header in `lib/api.ts`.

See `Backend/API.md` for full endpoint and request/response details.
