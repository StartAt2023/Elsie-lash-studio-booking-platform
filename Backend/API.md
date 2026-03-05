# Elsie Lash Studio — API Documentation

Backend REST API for the eyelash studio booking platform. Use this doc to integrate the frontend with the Express server.

---

## 1) Base URL

| Environment | Base URL |
|-------------|----------|
| **Local**   | `http://localhost:5001` |
| **Production** | `https://your-api-domain.com` *(replace with your deployed backend URL)* |

Default port is `5001` (override with `PORT` in `.env`). All API routes are prefixed with `/api`.

**Example:**  
`GET http://localhost:5001/api/services`

---

## 2) Authentication

**No auth for now.** All endpoints are public. When you add authentication later, use the **Common headers** section below for `Authorization` and document protected routes.

---

## 3) Common headers

Send these on every request where applicable:

| Header | Value | When |
|--------|--------|------|
| `Content-Type` | `application/json` | Required for `POST` and `PUT` bodies. |
| `Authorization` | *(not used yet)* | Leave empty until auth is implemented. |

**Example:**

```http
Content-Type: application/json
```

---

## 4) Error format

Errors return JSON with a `message` field. The HTTP status code is the error code (e.g. `404` = Not Found).

**Standard error body:**

```json
{
  "message": "Human-readable error description"
}
```

**404 for unknown route (notFound middleware):**

```json
{
  "message": "Route not found",
  "path": "/api/bookings/999"
}
```

**Typical status codes:**

| Code | Meaning |
|------|---------|
| `400` | Bad Request — validation / missing required fields |
| `404` | Not Found — resource or route not found |
| `500` | Internal Server Error — server-side error |

The backend does not currently return a separate `code` field in the body; use the HTTP status code.

---

## 5) Date & time

- **Date/time fields** (e.g. `date`, `createdAt`) are stored as provided or as ISO 8601 strings.
- **Business context:** All times are intended for **Australia/Sydney** timezone. The API does not convert timezones; send and display dates/times in the timezone your app uses (e.g. Sydney).

---

## 6) Endpoints by resource

---

### Health

#### GET /api/health

Check API is running.

**Query params:** None.

**Request body:** None.

**Success response:** `200 OK`

```json
{
  "status": "ok",
  "env": "development"
}
```

**curl example:**

```bash
curl -s http://localhost:5001/api/health
```

---

### Services

Base path: `/api/services`

---

#### GET /api/services

List all services.

**Query params:** None.

**Request body:** None.

**Success response:** `200 OK`

```json
[
  {
    "id": 1,
    "name": "Classic Lashes",
    "price": 120,
    "durationMinutes": 90,
    "description": "Natural, elegant extensions for everyday glamour."
  },
  {
    "id": 2,
    "name": "Hybrid Lashes",
    "price": 140,
    "durationMinutes": 100,
    "description": "A blend of classic and volume lashes for added fullness with a soft, wispy effect."
  }
]
```

**curl example:**

```bash
curl -s http://localhost:5001/api/services
```

---

#### GET /api/services/:id

Get one service by ID.

**Path params:** `id` (number) — service ID.

**Query params:** None.

**Request body:** None.

**Success response:** `200 OK`

```json
{
  "id": 1,
  "name": "Classic Lashes",
  "price": 120,
  "durationMinutes": 90,
  "description": "Natural, elegant extensions for everyday glamour."
}
```

**Error response:** `404 Not Found`

```json
{
  "message": "Service not found"
}
```

**curl example:**

```bash
curl -s http://localhost:5001/api/services/1
```

---

#### POST /api/services

Create a new service.

**Request body (JSON):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Service name. |
| `price` | number | No | Default `0`. |
| `durationMinutes` | number | No | Default `0`. |
| `description` | string | No | Default `""`. |

**Example:**

```json
{
  "name": "Mega Volume",
  "price": 180,
  "durationMinutes": 150,
  "description": "Maximum density and impact."
}
```

**Success response:** `201 Created`

```json
{
  "id": 4,
  "name": "Mega Volume",
  "price": 180,
  "durationMinutes": 150,
  "description": "Maximum density and impact."
}
```

**Error response:** `400 Bad Request` (e.g. missing `name`)

```json
{
  "message": "name is required"
}
```

**curl example:**

```bash
curl -s -X POST http://localhost:5001/api/services \
  -H "Content-Type: application/json" \
  -d '{"name":"Mega Volume","price":180,"durationMinutes":150,"description":"Maximum density and impact."}'
```

---

#### PUT /api/services/:id

Update a service.

**Path params:** `id` (number) — service ID.

**Request body (JSON):** Any subset of `name`, `price`, `durationMinutes`, `description`. Only sent fields are updated.

**Example:**

```json
{
  "price": 130,
  "description": "Updated description."
}
```

**Success response:** `200 OK`

```json
{
  "id": 1,
  "name": "Classic Lashes",
  "price": 130,
  "durationMinutes": 90,
  "description": "Updated description."
}
```

**Error response:** `404 Not Found`

```json
{
  "message": "Service not found"
}
```

**curl example:**

```bash
curl -s -X PUT http://localhost:5001/api/services/1 \
  -H "Content-Type: application/json" \
  -d '{"price":130}'
```

---

#### DELETE /api/services/:id

Delete a service.

**Path params:** `id` (number) — service ID.

**Request body:** None.

**Success response:** `204 No Content` (empty body).

**Error response:** `404 Not Found`

```json
{
  "message": "Service not found"
}
```

**curl example:**

```bash
curl -s -X DELETE http://localhost:5001/api/services/4
```

---

### Bookings

Base path: `/api/bookings`

**Date/time:** Use a date (or datetime) value appropriate for **Australia/Sydney**. The API stores the value as sent; it does not perform timezone conversion.

---

#### GET /api/bookings

List all bookings.

**Query params:** None.

**Request body:** None.

**Success response:** `200 OK`

```json
[
  {
    "id": 1,
    "fullName": "Jane Smith",
    "phone": "0412345678",
    "service": "Classic Lashes",
    "date": "2026-03-15",
    "notes": "Morning preferred",
    "createdAt": "2026-02-27T10:00:00.000Z"
  }
]
```

**curl example:**

```bash
curl -s http://localhost:5001/api/bookings
```

---

#### GET /api/bookings/:id

Get one booking by ID.

**Path params:** `id` (number) — booking ID.

**Request body:** None.

**Success response:** `200 OK`

```json
{
  "id": 1,
  "fullName": "Jane Smith",
  "phone": "0412345678",
  "service": "Classic Lashes",
  "date": "2026-03-15",
  "notes": "Morning preferred",
  "createdAt": "2026-02-27T10:00:00.000Z"
}
```

**Error response:** `404 Not Found`

```json
{
  "message": "Booking not found"
}
```

**curl example:**

```bash
curl -s http://localhost:5001/api/bookings/1
```

---

#### POST /api/bookings

Create a new booking.

**Request body (JSON):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fullName` | string | Yes | Client full name. |
| `phone` | string | Yes | Phone number. |
| `service` | string | Yes | Service name (e.g. "Classic Lashes"). |
| `date` | string | Yes | Preferred date (Australia/Sydney). |
| `notes` | string | No | Default `""`. |

**Example:**

```json
{
  "fullName": "Jane Smith",
  "phone": "0412345678",
  "service": "Classic Lashes",
  "date": "2026-03-15",
  "notes": "Morning preferred"
}
```

**Success response:** `201 Created`

```json
{
  "id": 1,
  "fullName": "Jane Smith",
  "phone": "0412345678",
  "service": "Classic Lashes",
  "date": "2026-03-15",
  "notes": "Morning preferred",
  "createdAt": "2026-02-27T10:00:00.000Z"
}
```

**Error response:** `400 Bad Request` (e.g. missing required field)

```json
{
  "message": "fullName, phone, service and date are required"
}
```

**curl example:**

```bash
curl -s -X POST http://localhost:5001/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Jane Smith","phone":"0412345678","service":"Classic Lashes","date":"2026-03-15","notes":"Morning preferred"}'
```

---

#### PUT /api/bookings/:id

Update a booking.

**Path params:** `id` (number) — booking ID.

**Request body (JSON):** Any subset of `fullName`, `phone`, `service`, `date`, `notes`. Only sent fields are updated.

**Example:**

```json
{
  "date": "2026-03-16",
  "notes": "Updated notes"
}
```

**Success response:** `200 OK`

```json
{
  "id": 1,
  "fullName": "Jane Smith",
  "phone": "0412345678",
  "service": "Classic Lashes",
  "date": "2026-03-16",
  "notes": "Updated notes",
  "createdAt": "2026-02-27T10:00:00.000Z"
}
```

**Error response:** `404 Not Found`

```json
{
  "message": "Booking not found"
}
```

**curl example:**

```bash
curl -s -X PUT http://localhost:5001/api/bookings/1 \
  -H "Content-Type: application/json" \
  -d '{"date":"2026-03-16"}'
```

---

#### DELETE /api/bookings/:id

Delete a booking.

**Path params:** `id` (number) — booking ID.

**Request body:** None.

**Success response:** `204 No Content` (empty body).

**Error response:** `404 Not Found`

```json
{
  "message": "Booking not found"
}
```

**curl example:**

```bash
curl -s -X DELETE http://localhost:5001/api/bookings/1
```

---

### Customers

Base path: `/api/customers`

---

#### GET /api/customers

List all customers.

**Query params:** None.

**Request body:** None.

**Success response:** `200 OK`

```json
[
  {
    "id": 1,
    "name": "Jane Smith",
    "phone": "0412345678",
    "email": "jane@example.com",
    "notes": "Prefers morning slots",
    "createdAt": "2026-02-27T10:00:00.000Z"
  }
]
```

**curl example:**

```bash
curl -s http://localhost:5001/api/customers
```

---

#### GET /api/customers/:id

Get one customer by ID.

**Path params:** `id` (number) — customer ID.

**Request body:** None.

**Success response:** `200 OK`

```json
{
  "id": 1,
  "name": "Jane Smith",
  "phone": "0412345678",
  "email": "jane@example.com",
  "notes": "Prefers morning slots",
  "createdAt": "2026-02-27T10:00:00.000Z"
}
```

**Error response:** `404 Not Found`

```json
{
  "message": "Customer not found"
}
```

**curl example:**

```bash
curl -s http://localhost:5001/api/customers/1
```

---

#### POST /api/customers

Create a new customer.

**Request body (JSON):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Customer name. |
| `phone` | string | Yes | Phone number. |
| `email` | string | No | Default `""`. |
| `notes` | string | No | Default `""`. |

**Example:**

```json
{
  "name": "Jane Smith",
  "phone": "0412345678",
  "email": "jane@example.com",
  "notes": "Prefers morning slots"
}
```

**Success response:** `201 Created`

```json
{
  "id": 1,
  "name": "Jane Smith",
  "phone": "0412345678",
  "email": "jane@example.com",
  "notes": "Prefers morning slots",
  "createdAt": "2026-02-27T10:00:00.000Z"
}
```

**Error response:** `400 Bad Request`

```json
{
  "message": "name and phone are required"
}
```

**curl example:**

```bash
curl -s -X POST http://localhost:5001/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Smith","phone":"0412345678","email":"jane@example.com"}'
```

---

#### PUT /api/customers/:id

Update a customer.

**Path params:** `id` (number) — customer ID.

**Request body (JSON):** Any subset of `name`, `phone`, `email`, `notes`.

**Success response:** `200 OK` — full customer object.

**Error response:** `404 Not Found`

```json
{
  "message": "Customer not found"
}
```

**curl example:**

```bash
curl -s -X PUT http://localhost:5001/api/customers/1 \
  -H "Content-Type: application/json" \
  -d '{"email":"jane.new@example.com"}'
```

---

#### DELETE /api/customers/:id

Delete a customer.

**Path params:** `id` (number) — customer ID.

**Success response:** `204 No Content`.

**Error response:** `404 Not Found`

```json
{
  "message": "Customer not found"
}
```

**curl example:**

```bash
curl -s -X DELETE http://localhost:5001/api/customers/1
```

---

### Gallery

Base path: `/api/gallery`

The gallery API has **no PUT endpoint**; items cannot be updated, only created and deleted.

---

#### GET /api/gallery

List all gallery items.

**Query params:** None.

**Request body:** None.

**Success response:** `200 OK`

```json
[
  {
    "id": 1,
    "category": "Classic",
    "title": "Classic set 1",
    "imageUrl": "/gallery/classic-1.jpg"
  },
  {
    "id": 2,
    "category": "Hybrid",
    "title": "Hybrid set 1",
    "imageUrl": "/gallery/hybrid-1.jpg"
  }
]
```

*Note: Seeded items may not include `description` or `createdAt`; created items will.*

**curl example:**

```bash
curl -s http://localhost:5001/api/gallery
```

---

#### GET /api/gallery/:id

Get one gallery item by ID.

**Path params:** `id` (number) — gallery item ID.

**Request body:** None.

**Success response:** `200 OK`

```json
{
  "id": 1,
  "category": "Classic",
  "title": "Classic set 1",
  "imageUrl": "/gallery/classic-1.jpg"
}
```

**Error response:** `404 Not Found`

```json
{
  "message": "Gallery item not found"
}
```

**curl example:**

```bash
curl -s http://localhost:5001/api/gallery/1
```

---

#### POST /api/gallery

Create a new gallery item.

**Request body (JSON):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Item title. |
| `imageUrl` | string | Yes | URL or path to the image. |
| `category` | string | No | Default `"Classic"`. |
| `description` | string | No | Default `""`. |

**Example:**

```json
{
  "title": "Volume set 2",
  "imageUrl": "/gallery/volume-2.jpg",
  "category": "Volume",
  "description": "Full volume look"
}
```

**Success response:** `201 Created`

```json
{
  "id": 4,
  "title": "Volume set 2",
  "category": "Volume",
  "imageUrl": "/gallery/volume-2.jpg",
  "description": "Full volume look",
  "createdAt": "2026-02-27T10:00:00.000Z"
}
```

**Error response:** `400 Bad Request`

```json
{
  "message": "title and imageUrl are required"
}
```

**curl example:**

```bash
curl -s -X POST http://localhost:5001/api/gallery \
  -H "Content-Type: application/json" \
  -d '{"title":"Volume set 2","imageUrl":"/gallery/volume-2.jpg","category":"Volume"}'
```

---

#### DELETE /api/gallery/:id

Delete a gallery item.

**Path params:** `id` (number) — gallery item ID.

**Request body:** None.

**Success response:** `204 No Content`.

**Error response:** `404 Not Found`

```json
{
  "message": "Gallery item not found"
}
```

**curl example:**

```bash
curl -s -X DELETE http://localhost:5001/api/gallery/4
```

---

## Quick reference

| Resource   | List          | Get one       | Create       | Update       | Delete       |
|-----------|---------------|---------------|--------------|--------------|--------------|
| Health    | `GET /api/health` | —          | —            | —            | —            |
| Services  | `GET /api/services` | `GET /api/services/:id` | `POST /api/services` | `PUT /api/services/:id` | `DELETE /api/services/:id` |
| Bookings  | `GET /api/bookings` | `GET /api/bookings/:id` | `POST /api/bookings` | `PUT /api/bookings/:id` | `DELETE /api/bookings/:id` |
| Customers | `GET /api/customers` | `GET /api/customers/:id` | `POST /api/customers` | `PUT /api/customers/:id` | `DELETE /api/customers/:id` |
| Gallery   | `GET /api/gallery` | `GET /api/gallery/:id` | `POST /api/gallery` | —            | `DELETE /api/gallery/:id` |

All IDs in paths are numeric. Request/response bodies use **exact field names** as in this document (e.g. `fullName` for bookings, `name` for customers and services).
