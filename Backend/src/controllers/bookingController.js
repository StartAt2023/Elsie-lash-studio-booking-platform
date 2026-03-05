import {
  listBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../models/bookingModel.js";

export function getBookings(req, res) {
  res.json(listBookings());
}

export function getBooking(req, res) {
  const id = Number(req.params.id);
  const booking = getBookingById(id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  res.json(booking);
}

export function createBookingHandler(req, res) {
  const { fullName, phone, service, date, notes } = req.body;
  if (!fullName || !phone || !service || !date) {
    return res.status(400).json({ message: "fullName, phone, service and date are required" });
  }
  const booking = createBooking({ fullName, phone, service, date, notes });
  res.status(201).json(booking);
}

export function updateBookingHandler(req, res) {
  const id = Number(req.params.id);
  const updated = updateBooking(id, req.body);
  if (!updated) return res.status(404).json({ message: "Booking not found" });
  res.json(updated);
}

export function deleteBookingHandler(req, res) {
  const id = Number(req.params.id);
  const ok = deleteBooking(id);
  if (!ok) return res.status(404).json({ message: "Booking not found" });
  res.status(204).send();
}

