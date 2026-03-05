// Example in-memory services. Replace with DB or CMS as needed.

let services = [
  {
    id: 1,
    name: "Classic Lashes",
    price: 120,
    durationMinutes: 90,
    description: "Natural, elegant extensions for everyday glamour.",
  },
  {
    id: 2,
    name: "Hybrid Lashes",
    price: 140,
    durationMinutes: 100,
    description:
      "A blend of classic and volume lashes for added fullness with a soft, wispy effect.",
  },
  {
    id: 3,
    name: "Volume Lashes",
    price: 160,
    durationMinutes: 120,
    description:
      "Lightweight multi-dimensional fans create a full, fluffy lash line.",
  },
];

let currentId = services.length + 1;

export function listServices() {
  return services;
}

export function getServiceById(id) {
  return services.find((s) => s.id === id) || null;
}

export function createService(data) {
  const service = {
    id: currentId++,
    name: data.name,
    price: data.price ?? 0,
    durationMinutes: data.durationMinutes ?? 0,
    description: data.description || "",
  };
  services.push(service);
  return service;
}

export function updateService(id, data) {
  const index = services.findIndex((s) => s.id === id);
  if (index === -1) return null;
  services[index] = { ...services[index], ...data };
  return services[index];
}

export function deleteService(id) {
  const index = services.findIndex((s) => s.id === id);
  if (index === -1) return false;
  services.splice(index, 1);
  return true;
}

