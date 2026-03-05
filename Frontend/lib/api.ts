/**
 * API client for Elsie Lash Studio backend.
 * Base URL from NEXT_PUBLIC_API_BASE_URL (default: http://localhost:5001).
 * All date/time values are in Australia/Sydney context.
 */

const getBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";
};

/** Normalized API error (message + status code). */
export interface ApiError {
  message: string;
  statusCode: number;
}

/** Service from GET /api/services */
export interface Service {
  id: number;
  name: string;
  price: number;
  durationMinutes: number;
  description: string;
}

/** Booking from GET/POST /api/bookings */
export interface Booking {
  id: number;
  fullName: string;
  phone: string;
  service: string;
  date: string;
  notes: string;
  createdAt: string;
}

/** Request body for POST /api/bookings */
export interface CreateBookingBody {
  fullName: string;
  phone: string;
  service: string;
  date: string;
  notes?: string;
}

/** Gallery item from GET /api/gallery */
export interface GalleryItemApi {
  id: number;
  title: string;
  imageUrl: string;
  category: string;
  description?: string;
  createdAt?: string;
}

async function parseErrorResponse(res: Response): Promise<ApiError> {
  let message = res.statusText || "Request failed";
  try {
    const data = await res.json();
    if (data && typeof data.message === "string") message = data.message;
  } catch {
    // ignore
  }
  return { message, statusCode: res.status };
}

/**
 * Fetch JSON from the backend. Throws ApiError on non-2xx.
 */
async function fetchApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await parseErrorResponse(res);
    throw err;
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/** GET /api/services */
export async function getServices(): Promise<Service[]> {
  return fetchApi<Service[]>("/api/services");
}

/** GET /api/bookings (list) */
export async function getBookings(): Promise<Booking[]> {
  return fetchApi<Booking[]>("/api/bookings");
}

/** POST /api/bookings */
export async function createBooking(body: CreateBookingBody): Promise<Booking> {
  return fetchApi<Booking>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** GET /api/gallery */
export async function getGallery(): Promise<GalleryItemApi[]> {
  return fetchApi<GalleryItemApi[]>("/api/gallery");
}

/** GET /api/health */
export async function getHealth(): Promise<{ status: string; env: string }> {
  return fetchApi<{ status: string; env: string }>("/api/health");
}
