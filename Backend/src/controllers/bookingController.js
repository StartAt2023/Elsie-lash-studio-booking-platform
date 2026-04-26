import Booking from "../models/Booking.js";
import {
  sendAdminBookingEmail,
  sendCustomerConfirmationEmail,
  isValidCustomerEmail,
} from "../services/emailService.js";

function toResponse(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    id: obj._id,
    fullName: obj.fullName,
    phone: obj.phone,
    service: obj.service,
    date: obj.date,
    notes: obj.notes ?? "",
    status: obj.status,
    createdAt: obj.createdAt,
  };
}

export async function getBookings(req, res) {
  try {
    const docs = await Booking.find().sort({ createdAt: -1 }).lean();
    res.json(
      docs.map((d) => ({
        id: d._id,
        fullName: d.fullName,
        phone: d.phone,
        service: d.service,
        date: d.date,
        notes: d.notes ?? "",
        status: d.status,
        createdAt: d.createdAt,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch bookings" });
  }
}

export async function getBooking(req, res) {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(toResponse(booking));
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch booking" });
  }
}

export async function createBookingHandler(req, res) {
  const { fullName, phone, service, date, notes, email: emailField } = req.body;
  if (!fullName || !phone || !service || !date) {
    return res.status(400).json({ message: "fullName, phone, service and date are required" });
  }
  const clientEmail = typeof emailField === "string" ? emailField.trim() : "";
  try {
    const booking = await Booking.create({ fullName, phone, service, date, notes: notes ?? "" });

    const emailPayload = {
      fullName,
      phone,
      service,
      date,
      notes: notes ?? "",
      email: clientEmail,
    };

    const emailTasks = [sendAdminBookingEmail(emailPayload)];
    if (isValidCustomerEmail(clientEmail)) {
      emailTasks.push(sendCustomerConfirmationEmail(emailPayload));
    }
    const emailLabels = ["admin", "customer"];
    void Promise.allSettled(emailTasks).then((results) => {
      results.forEach((r, i) => {
        if (r.status === "rejected") {
          console.error(
            `[bookingController] ${emailLabels[i] ?? "email"} notification failed:`,
            r.reason?.message || r.reason
          );
        }
      });
    });

    res.status(201).json(toResponse(booking));
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to create booking" });
  }
}

export async function updateBookingHandler(req, res) {
  try {
    const body = req.body;
    const updates = {};
    const allowed = ["fullName", "phone", "service", "date", "notes", "status"];
    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key];
    }
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(toResponse(booking));
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to update booking" });
  }
}

export async function deleteBookingHandler(req, res) {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to delete booking" });
  }
}
