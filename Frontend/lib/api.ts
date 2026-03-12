/**
 * API client for Elsie Lash Studio backend.
 * Base URL from NEXT_PUBLIC_API_BASE_URL. Typed GET/POST/PUT/DELETE with timeout and optional auth.
 * Date/time context: Australia/Sydney.
 */

const DEFAULT_BASE_URL = "http://localhost:5001";
const DEFAULT_TIMEOUT_MS = 15_000;

/** Base URL for API (no trailing slash). Uses NEXT_PUBLIC_API_BASE_URL; falls back to localhost only in development. */
export function getBaseUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    (process.env.NODE_ENV === "development" ? DEFAULT_BASE_URL : "");
  return url.replace(/\/$/, "");
}

/**
 * Optional token getter for Authorization header. Set when auth exists so admin (or other) calls can attach the token.
 * Example: apiConfig.getToken = () => sessionStorage.getItem('auth_token')
 */
export const apiConfig: {
  getToken?: () => string | null;
  timeoutMs?: number;
} = {
  timeoutMs: DEFAULT_TIMEOUT_MS,
};

/** Normalized API error: status code + message. */
export interface ApiError {
  message: string;
  statusCode: number;
}

/** User-facing message for an error (timeout, network, or API message). */
export function getApiErrorMessage(err: ApiError): string {
  if (err.statusCode === 0) return err.message; // already a generic message (timeout/network)
  if (err.statusCode === 400) return err.message || "Invalid request.";
  if (err.statusCode === 401) return "Please sign in again.";
  if (err.statusCode === 404) return err.message || "Not found.";
  if (err.statusCode >= 500) return "Something went wrong. Please try again.";
  return err.message || "Request failed.";
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

function buildHeaders(customHeaders?: HeadersInit): Headers {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = apiConfig.getToken?.();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const merged = new Headers(customHeaders);
  merged.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });
  return new Headers(headers);
}

/**
 * Low-level request: JSON body support, timeout, auth header from apiConfig.getToken.
 * Throws ApiError on non-2xx, timeout, or network failure.
 */
export async function request<T>(
  path: string,
  options: {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    headers?: HeadersInit;
    signal?: AbortSignal;
  }
): Promise<T> {
  const url = `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const timeoutMs = apiConfig.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const signal = options.signal ?? controller.signal;

  try {
    const res = await fetch(url, {
      method: options.method,
      headers: buildHeaders(options.headers),
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      const err = await parseErrorResponse(res);
      throw err;
    }
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  } catch (e) {
    clearTimeout(timeoutId);
    if (
      e &&
      typeof e === "object" &&
      "statusCode" in e &&
      "message" in e &&
      typeof (e as ApiError).message === "string"
    )
      throw e as ApiError;
    if (e instanceof DOMException && e.name === "AbortError") {
      throw {
        message: "Request timed out. Please try again.",
        statusCode: 0,
      } as ApiError;
    }
    throw {
      message: "Unable to connect. Please check your connection and try again.",
      statusCode: 0,
    } as ApiError;
  }
}

/** GET request. */
export function get<T>(path: string, options?: { signal?: AbortSignal }): Promise<T> {
  return request<T>(path, { ...options, method: "GET" });
}

/** POST request with JSON body. */
export function post<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, { method: "POST", body });
}

/** PUT request with JSON body. */
export function put<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, { method: "PUT", body });
}

/** PATCH request with JSON body. */
export function patch<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, { method: "PATCH", body });
}

/** DELETE request. */
export function del<T>(path: string): Promise<T> {
  return request<T>(path, { method: "DELETE" });
}

// --- Types (from API.md) ---

export interface HealthResponse {
  status: string;
  env: string;
}

export interface Service {
  id: string | number;
  name: string;
  price: number;
  durationMinutes: number;
  description: string;
  active?: boolean;
  sortOrder?: number;
}

export interface Booking {
  id: string | number;
  fullName: string;
  phone: string;
  service: string;
  date: string;
  notes: string;
  status?: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface CreateBookingBody {
  fullName: string;
  phone: string;
  service: string;
  date: string;
  notes?: string;
}

export interface UpdateBookingBody {
  fullName?: string;
  phone?: string;
  service?: string;
  date?: string;
  notes?: string;
  status?: "pending" | "confirmed" | "completed" | "cancelled";
}

export interface Customer {
  id: string | number;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  tags?: string[];
  createdAt?: string;
}

export interface CreateCustomerBody {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  tags?: string[];
}

export interface UpdateCustomerBody {
  name?: string;
  phone?: string;
  email?: string;
  notes?: string;
  tags?: string[];
}

export interface GalleryItemApi {
  id: string | number;
  category: string;
  title: string;
  imageUrl: string;
  description?: string;
  active?: boolean;
  sortOrder?: number;
  createdAt?: string;
}

export interface CreateGalleryBody {
  title: string;
  imageUrl: string;
  category?: string;
  description?: string;
  active?: boolean;
  sortOrder?: number;
}

export interface SiteContent {
  aboutText: string;
  certificateUrls: string[];
  policies: Record<string, string>;
}

export interface SiteSettings {
  businessHours: string;
  depositAmount: number;
  cancellationWindowHours: number;
  lateArrivalGraceMinutes: number;
  touchUpPolicyWindow: string;
}

// --- Resource helpers (public + admin) ---

/** GET /api/health */
export function getHealth(): Promise<HealthResponse> {
  return get<HealthResponse>("/api/health");
}

/** GET /api/services */
export function getServices(): Promise<Service[]> {
  return get<Service[]>("/api/services");
}

/** GET /api/services/:id */
export function getService(id: string | number): Promise<Service> {
  return get<Service>(`/api/services/${id}`);
}

/** POST /api/services */
export function createService(body: { name: string; price?: number; durationMinutes?: number; description?: string; active?: boolean; sortOrder?: number }): Promise<Service> {
  return post<Service>("/api/services", body);
}

/** PUT /api/services/:id */
export function updateService(id: string | number, body: Partial<Pick<Service, "name" | "price" | "durationMinutes" | "description" | "active" | "sortOrder">>): Promise<Service> {
  return put<Service>(`/api/services/${id}`, body);
}

/** DELETE /api/services/:id */
export function deleteService(id: string | number): Promise<void> {
  return del(`/api/services/${id}`);
}

/** GET /api/bookings */
export function getBookings(): Promise<Booking[]> {
  return get<Booking[]>("/api/bookings");
}

/** GET /api/bookings/:id */
export function getBooking(id: string | number): Promise<Booking> {
  return get<Booking>(`/api/bookings/${id}`);
}

/** POST /api/bookings */
export function createBooking(body: CreateBookingBody): Promise<Booking> {
  return post<Booking>("/api/bookings", body);
}

/** PUT /api/bookings/:id */
export function updateBooking(id: string | number, body: UpdateBookingBody): Promise<Booking> {
  return put<Booking>(`/api/bookings/${id}`, body);
}

/** DELETE /api/bookings/:id */
export function deleteBooking(id: string | number): Promise<void> {
  return del(`/api/bookings/${id}`);
}

/** GET /api/customers */
export function getCustomers(): Promise<Customer[]> {
  return get<Customer[]>("/api/customers");
}

/** GET /api/customers/:id */
export function getCustomer(id: string | number): Promise<Customer> {
  return get<Customer>(`/api/customers/${id}`);
}

/** POST /api/customers */
export function createCustomer(body: CreateCustomerBody): Promise<Customer> {
  return post<Customer>("/api/customers", body);
}

/** PUT /api/customers/:id */
export function updateCustomer(id: string | number, body: UpdateCustomerBody): Promise<Customer> {
  return put<Customer>(`/api/customers/${id}`, body);
}

/** DELETE /api/customers/:id */
export function deleteCustomer(id: string | number): Promise<void> {
  return del(`/api/customers/${id}`);
}

/** GET /api/gallery */
export function getGallery(): Promise<GalleryItemApi[]> {
  return get<GalleryItemApi[]>("/api/gallery");
}

/** GET /api/gallery/:id */
export function getGalleryItem(id: string | number): Promise<GalleryItemApi> {
  return get<GalleryItemApi>(`/api/gallery/${id}`);
}

/** POST /api/gallery */
export function createGalleryItem(body: CreateGalleryBody): Promise<GalleryItemApi> {
  return post<GalleryItemApi>("/api/gallery", body);
}

/** PUT /api/gallery/:id */
export function updateGalleryItem(id: string | number, body: Partial<Pick<GalleryItemApi, "title" | "imageUrl" | "category" | "description" | "active" | "sortOrder">>): Promise<GalleryItemApi> {
  return put<GalleryItemApi>(`/api/gallery/${id}`, body);
}

/** DELETE /api/gallery/:id */
export function deleteGalleryItem(id: string | number): Promise<void> {
  return del(`/api/gallery/${id}`);
}

/** GET /api/content */
export function getContent(): Promise<SiteContent> {
  return get<SiteContent>("/api/content");
}

/** PUT /api/content */
export function updateContent(body: Partial<SiteContent>): Promise<SiteContent> {
  return put<SiteContent>("/api/content", body);
}

/** GET /api/settings */
export function getSettings(): Promise<SiteSettings> {
  return get<SiteSettings>("/api/settings");
}

/** PUT /api/settings */
export function updateSettings(body: Partial<SiteSettings>): Promise<SiteSettings> {
  return put<SiteSettings>("/api/settings", body);
}
