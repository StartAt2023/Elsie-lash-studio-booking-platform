import Customer from "../models/Customer.js";

function toResponse(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    id: obj._id,
    name: obj.name,
    phone: obj.phone,
    email: obj.email ?? "",
    notes: obj.notes ?? "",
    tags: obj.tags ?? [],
    createdAt: obj.createdAt,
  };
}

export async function getCustomers(req, res) {
  try {
    const docs = await Customer.find().sort({ createdAt: -1 }).lean();
    res.json(
      docs.map((d) => ({
        id: d._id,
        name: d.name,
        phone: d.phone,
        email: d.email ?? "",
        notes: d.notes ?? "",
        tags: d.tags ?? [],
        createdAt: d.createdAt,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch customers" });
  }
}

export async function getCustomer(req, res) {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(toResponse(customer));
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch customer" });
  }
}

export async function createCustomerHandler(req, res) {
  const { name, phone } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ message: "name and phone are required" });
  }
  try {
    const customer = await Customer.create({
      name: name.trim(),
      phone: phone.trim(),
      email: (req.body.email || "").trim(),
      notes: (req.body.notes || "").trim(),
      tags: Array.isArray(req.body.tags) ? req.body.tags : [],
    });
    res.status(201).json(toResponse(customer));
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to create customer" });
  }
}

export async function updateCustomerHandler(req, res) {
  try {
    const body = req.body;
    const updates = {};
    ["name", "phone", "email", "notes", "tags"].forEach((key) => {
      if (body[key] !== undefined) updates[key] = body[key];
    });
    if (Array.isArray(updates.tags)) {
      updates.tags = updates.tags.filter((t) => typeof t === "string" && t.trim());
    }
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(toResponse(customer));
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to update customer" });
  }
}

export async function deleteCustomerHandler(req, res) {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to delete customer" });
  }
}
