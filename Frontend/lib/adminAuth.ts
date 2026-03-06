/**
 * TEMPORARY: Client-only admin gate. No backend auth.
 * Replace with proper server-side auth (e.g. NextAuth, API session) later.
 * Password is checked in the browser (NEXT_PUBLIC_ADMIN_PASSWORD) — do not use a sensitive password.
 */

export const ADMIN_SESSION_KEY = "elsie_admin_session";

export function getAdminSession(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
}

export function setAdminSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}
