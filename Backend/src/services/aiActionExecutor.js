import Service from "../models/Service.js";
import Booking from "../models/Booking.js";
import Gallery from "../models/Gallery.js";

const BOOKING_STATUSES = ["pending", "confirmed", "completed", "cancelled"];

function todayYmd() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * @param {string} action
 * @param {Record<string, unknown>} params
 * @returns {Promise<{ ok: boolean; message: string; data?: unknown }>}
 */
export async function executeAiAction(action, params) {
  const p = params && typeof params === "object" ? params : {};

  try {
    switch (action) {
      case "list_services": {
        const docs = await Service.find().sort({ sortOrder: 1 }).lean();
        const list = docs.map((d) => ({
          id: String(d._id),
          name: d.name,
          price: d.price,
          durationMinutes: d.duration,
        }));
        return { ok: true, message: `Found ${list.length} service(s).`, data: list };
      }

      case "create_service": {
        const name = String(p.name || "").trim();
        if (!name) return { ok: false, message: "Service name is required." };
        const price = Number(p.price ?? 0);
        const durationMinutes = Number(p.durationMinutes ?? p.duration ?? 0);
        const description = String(p.description ?? "");
        const doc = await Service.create({
          name,
          price: Number.isFinite(price) ? price : 0,
          duration: Number.isFinite(durationMinutes) ? durationMinutes : 0,
          description,
          active: true,
          sortOrder: 0,
        });
        return {
          ok: true,
          message: `Created service "${doc.name}" (price ${doc.price}, duration ${doc.duration} min).`,
          data: { id: String(doc._id) },
        };
      }

      case "update_service": {
        const nameMatch = String(p.nameMatch || p.name || "").trim();
        if (!nameMatch) return { ok: false, message: "nameMatch is required to find the service." };
        const service = await Service.findOne({
          name: new RegExp(`^${escapeRegex(nameMatch)}$`, "i"),
        });
        if (!service) {
          const partial = await Service.findOne({
            name: new RegExp(escapeRegex(nameMatch), "i"),
          });
          if (!partial) return { ok: false, message: `No service matching "${nameMatch}".` };
          return applyServiceUpdate(partial, p);
        }
        return applyServiceUpdate(service, p);
      }

      case "get_booking_stats": {
        const scope = String(p.scope || "today");
        if (scope === "today") {
          const day = todayYmd();
          const count = await Booking.countDocuments({
            date: { $regex: new RegExp(`^${escapeRegex(day)}`) },
          });
          return { ok: true, message: `Bookings scheduled for today (${day}): ${count}.`, data: { count, date: day } };
        }
        if (scope === "pending") {
          const count = await Booking.countDocuments({ status: "pending" });
          return { ok: true, message: `Pending bookings: ${count}.`, data: { count } };
        }
        const total = await Booking.countDocuments();
        return { ok: true, message: `Total bookings in database: ${total}.`, data: { count: total } };
      }

      case "update_booking_status": {
        const fullNameContains = String(p.fullNameContains || p.fullName || "").trim();
        const status = String(p.status || "").toLowerCase();
        if (!fullNameContains) return { ok: false, message: "Customer name is required." };
        if (!BOOKING_STATUSES.includes(status)) {
          return { ok: false, message: `Invalid status. Use one of: ${BOOKING_STATUSES.join(", ")}.` };
        }
        const booking = await Booking.findOne({
          fullName: new RegExp(escapeRegex(fullNameContains), "i"),
        }).sort({ createdAt: -1 });
        if (!booking) return { ok: false, message: `No booking found for "${fullNameContains}".` };
        booking.status = status;
        await booking.save();
        return {
          ok: true,
          message: `Updated booking for "${booking.fullName}" to status "${status}".`,
          data: { id: String(booking._id) },
        };
      }

      case "delete_bookings": {
        const filter = {};
        if (p.status && BOOKING_STATUSES.includes(String(p.status).toLowerCase())) {
          filter.status = String(p.status).toLowerCase();
        }
        if (p.month && /^\d{4}-\d{2}$/.test(String(p.month))) {
          const [y, m] = String(p.month).split("-");
          filter.date = { $regex: new RegExp(`^${y}-${m}-`) };
        }
        if (p.nameContains) {
          filter.fullName = new RegExp(escapeRegex(String(p.nameContains)), "i");
        }
        if (Object.keys(filter).length === 0) {
          return {
            ok: false,
            message: "Refusing to delete without filters. Specify status, month (YYYY-MM), and/or nameContains.",
          };
        }
        const result = await Booking.deleteMany(filter);
        return { ok: true, message: `Deleted ${result.deletedCount} booking(s).`, data: { deletedCount: result.deletedCount } };
      }

      case "create_gallery_item": {
        const title = String(p.title || "").trim();
        if (!title) return { ok: false, message: "Gallery title is required." };
        const imageUrl = String(p.imageUrl || "").trim();
        if (!imageUrl) {
          return {
            ok: false,
            message: "imageUrl is required for gallery items. Use the admin Gallery page to upload to Cloudinary, or provide a public image URL.",
          };
        }
        const item = await Gallery.create({
          title,
          imageUrl,
          publicId: String(p.publicId || "").trim(),
          category: String(p.category || "Classic").trim(),
          description: String(p.description || "").trim(),
          active: p.active !== false,
          sortOrder: Number(p.sortOrder) || 0,
        });
        return {
          ok: true,
          message: `Created gallery item "${item.title}" (${item.category}).`,
          data: { id: String(item._id) },
        };
      }

      case "list_gallery": {
        const docs = await Gallery.find().sort({ sortOrder: 1 }).lean();
        const list = docs.map((d) => ({
          id: String(d._id),
          title: d.title,
          category: d.category,
          active: d.active,
        }));
        return { ok: true, message: `${list.length} gallery item(s) (including inactive).`, data: list };
      }

      case "chat":
        return { ok: true, message: String(p._fallbackReply || "OK."), data: null };

      default:
        return { ok: false, message: `Unknown action: ${action}` };
    }
  } catch (err) {
    console.error("[aiActionExecutor]", err);
    return { ok: false, message: err.message || "Action failed." };
  }
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function applyServiceUpdate(service, p) {
  const updates = {};
  if (p.price !== undefined) updates.price = Number(p.price);
  if (p.durationMinutes !== undefined) updates.duration = Number(p.durationMinutes);
  if (p.duration !== undefined) updates.duration = Number(p.duration);
  if (p.description !== undefined) updates.description = String(p.description);
  if (p.name !== undefined && String(p.name).trim()) updates.name = String(p.name).trim();
  if (Object.keys(updates).length === 0) {
    return { ok: false, message: "No fields to update (price, durationMinutes, description, name)." };
  }
  Object.assign(service, updates);
  await service.save();
  return {
    ok: true,
    message: `Updated service "${service.name}".`,
    data: { id: String(service._id) },
  };
}
