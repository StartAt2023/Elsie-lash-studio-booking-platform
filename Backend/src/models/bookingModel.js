// Simple in-memory store for demo purposes.
// Replace with a database model in production.

let bookings = [];
let currentId = 1;

export function listBookings() {
  return bookings;
}

export function getBookingById(id) {
  return bookings.find((b) => b.id === id) || null;
}

export function createBooking(data) {
  const booking = {
    id: currentId++,
    fullName: data.fullName,
    phone: data.phone,
    service: data.service,
    date: data.date,
    notes: data.notes || "",
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  return booking;
}

export function updateBooking(id, data) {
  const index = bookings.findIndex((b) => b.id === id);
  if (index === -1) return null;
  bookings[index] = { ...bookings[index], ...data };
  return bookings[index];
}

export function deleteBooking(id) {
  const index = bookings.findIndex((b) => b.id === id);
  if (index === -1) return false;
  bookings.splice(index, 1);
  return true;
}

