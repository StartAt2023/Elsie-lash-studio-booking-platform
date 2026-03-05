import {
  listServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../models/serviceModel.js";

export function getServices(req, res) {
  res.json(listServices());
}

export function getService(req, res) {
  const id = Number(req.params.id);
  const service = getServiceById(id);
  if (!service) return res.status(404).json({ message: "Service not found" });
  res.json(service);
}

export function createServiceHandler(req, res) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "name is required" });
  }
  const service = createService(req.body);
  res.status(201).json(service);
}

export function updateServiceHandler(req, res) {
  const id = Number(req.params.id);
  const updated = updateService(id, req.body);
  if (!updated) return res.status(404).json({ message: "Service not found" });
  res.json(updated);
}

export function deleteServiceHandler(req, res) {
  const id = Number(req.params.id);
  const ok = deleteService(id);
  if (!ok) return res.status(404).json({ message: "Service not found" });
  res.status(204).send();
}

