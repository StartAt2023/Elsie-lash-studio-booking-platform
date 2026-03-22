/**
 * Verifies X-Admin-Password against ADMIN_PASSWORD (server env).
 * Must match the value used by the frontend admin login (NEXT_PUBLIC_ADMIN_PASSWORD).
 */
export function requireAdminPassword(req, res, next) {
  const sent = req.get("X-Admin-Password");
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return res.status(503).json({ message: "Admin authentication is not configured on the server." });
  }
  if (!sent || sent !== expected) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}
