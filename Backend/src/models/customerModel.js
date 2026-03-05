let customers = [];
let currentId = 1;

export function listCustomers() {
  return customers;
}

export function getCustomerById(id) {
  return customers.find((c) => c.id === id) || null;
}

export function createCustomer(data) {
  const customer = {
    id: currentId++,
    name: data.name,
    phone: data.phone,
    email: data.email || "",
    notes: data.notes || "",
    createdAt: new Date().toISOString(),
  };
  customers.push(customer);
  return customer;
}

export function updateCustomer(id, data) {
  const index = customers.findIndex((c) => c.id === id);
  if (index === -1) return null;
  customers[index] = { ...customers[index], ...data };
  return customers[index];
}

export function deleteCustomer(id) {
  const index = customers.findIndex((c) => c.id === id);
  if (index === -1) return false;
  customers.splice(index, 1);
  return true;
}

