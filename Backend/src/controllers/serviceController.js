import Service from "../models/Service.js";

function toResponse(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    id: obj._id,
    name: obj.name,
    price: obj.price,
    durationMinutes: obj.duration,
    description: obj.description ?? "",
    active: obj.active,
  };
}

function fromBody(body) {
  const { name, price, durationMinutes, duration, description } = body;
  return {
    name,
    price: price ?? 0,
    duration: durationMinutes ?? duration ?? 0,
    description: description ?? "",
    active: body.active !== undefined ? body.active : true,
  };
}

export async function getServices(req, res) {
  try {
    const docs = await Service.find().lean();
    res.json(
      docs.map((d) => ({
        id: d._id,
        name: d.name,
        price: d.price,
        durationMinutes: d.duration,
        description: d.description ?? "",
        active: d.active,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch services" });
  }
}

export async function getService(req, res) {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(toResponse(service));
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch service" });
  }
}

export async function createServiceHandler(req, res) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "name is required" });
  }
  try {
    const service = await Service.create(fromBody(req.body));
    res.status(201).json(toResponse(service));
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to create service" });
  }
}

export async function updateServiceHandler(req, res) {
  try {
    const body = req.body;
    const updates = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.price !== undefined) updates.price = body.price;
    if (body.durationMinutes !== undefined) updates.duration = body.durationMinutes;
    if (body.duration !== undefined) updates.duration = body.duration;
    if (body.description !== undefined) updates.description = body.description;
    if (body.active !== undefined) updates.active = body.active;
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(toResponse(service));
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to update service" });
  }
}

export async function deleteServiceHandler(req, res) {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to delete service" });
  }
}
