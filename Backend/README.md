# Elsie Lash Studio — Backend

Node.js + Express API for the booking platform. Uses MongoDB (Atlas) and SendGrid for email notifications.

## Environment variables

Copy `.env.example` to `.env` and set values. Required for production:

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string (e.g. MongoDB Atlas). Required. |
| `SENDGRID_API_KEY` | SendGrid API key for booking notification emails. Optional; if unset, bookings still succeed but no email is sent. |
| `SENDER_EMAIL` | From address for notification emails. |
| `ADMIN_NOTIFICATION_EMAIL` | Recipient for new-booking notifications. |
| `ADMIN_PASSWORD` | Must match frontend `NEXT_PUBLIC_ADMIN_PASSWORD`. Required for gallery admin list + upload. |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Gallery uploads (`POST /api/gallery/upload`). |

Optional: `PORT` (default 5001), `FRONTEND_URL` / `ALLOWED_ORIGINS` for CORS.

## Run locally

```bash
npm install
npm run dev
```

Server runs on port 5001 (or `PORT` from env). See `API.md` for endpoints.

## Deploying to Render

1. **Create a Web Service**
   - In [Render](https://render.com), New → Web Service.
   - Connect your repo and set **Root Directory** to `Backend`.

2. **Build & start**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start` (runs `node src/server.js`).
   - Render sets `PORT` automatically; the server uses `process.env.PORT || 5001`.

3. **Environment variables**
   - In the Render service: **Environment** tab, add:
     - `MONGO_URI` — Your MongoDB Atlas connection string.
     - `SENDGRID_API_KEY` — SendGrid API key (optional).
     - `SENDER_EMAIL` — From address for notifications.
     - `ADMIN_NOTIFICATION_EMAIL` — Where to receive booking notifications.
     - `ADMIN_PASSWORD` — Admin login (for frontend).
   - For production, set `CLIENT_ORIGIN` to your frontend URL (e.g. `https://your-app.vercel.app`) so CORS allows requests.

4. **Deploy**
   - Save; Render builds and starts the server. The API will be available at `https://<your-service>.onrender.com`. Use this URL as `NEXT_PUBLIC_API_BASE_URL` in your frontend (e.g. on Vercel).
