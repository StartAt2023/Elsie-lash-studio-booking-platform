import dotenv from "dotenv";

dotenv.config();

/** Allowed CORS origins (whitelist). Always includes local dev; add FRONTEND_URL and/or ALLOWED_ORIGINS (comma-separated) for production. */
function getAllowedOrigins() {
  const list = ["http://localhost:3000"];
  const frontendUrl = process.env.FRONTEND_URL?.trim();
  if (frontendUrl) list.push(frontendUrl);
  const extra = process.env.ALLOWED_ORIGINS;
  if (extra) {
    extra.split(",").forEach((s) => {
      const o = s.trim();
      if (o && !list.includes(o)) list.push(o);
    });
  }
  return list;
}

export const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT ? Number(process.env.PORT) : 5001,
  allowedOrigins: getAllowedOrigins(),
};

