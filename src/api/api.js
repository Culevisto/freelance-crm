const BASE = "/api";

export const fetchClients = () =>
  fetch(`${BASE}/clients`).then(r => r.json());

export const fetchClient = (id) =>
  fetch(`${BASE}/clients/${id}`).then(r => r.json());

export const createClient = (data) =>
  fetch(`${BASE}/clients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, createdAt: new Date().toISOString().slice(0, 10), paid: 0 }),
  }).then(r => r.json());

export const updateClient = (id, data) =>
  fetch(`${BASE}/clients/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const deleteClient = (id) =>
  fetch(`${BASE}/clients/${id}`, { method: "DELETE" });

export const fetchInteractions = (clientId) =>
  fetch(`${BASE}/interactions?clientId=${clientId}&_sort=date&_order=desc`).then(r => r.json());

export const createInteraction = (data) =>
  fetch(`${BASE}/interactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, date: new Date().toISOString().slice(0, 10) }),
  }).then(r => r.json());

export const deleteInteraction = (id) =>
  fetch(`${BASE}/interactions/${id}`, { method: "DELETE" });

export const fetchServices = () =>
  fetch(`${BASE}/services`).then(r => r.json());