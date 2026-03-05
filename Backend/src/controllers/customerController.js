import {
  listCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../models/customerModel.js";

export function getCustomers(req, res) {
  res.json(listCustomers());
}

export function getCustomer(req, res) {
  const id = Number(req.params.id);
  const customer = getCustomerById(id);
  if (!customer) return res.status(404).json({ message: "Customer not found" });
  res.json(customer);
}

export function createCustomerHandler(req, res) {
  const { name, phone } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ message: "name and phone are required" });
  }
  const customer = createCustomer(req.body);
  res.status(201).json(customer);
}

export function updateCustomerHandler(req, res) {
  const id = Number(req.params.id);
  const updated = updateCustomer(id, req.body);
  if (!updated) return res.status(404).json({ message: "Customer not found" });
  res.json(updated);
}

export function deleteCustomerHandler(req, res) {
  const id = Number(req.params.id);
  const ok = deleteCustomer(id);
  if (!ok) return res.status(404).json({ message: "Customer not found" });
  res.status(204).send();
}

