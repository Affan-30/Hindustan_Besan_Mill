import api from "./api.js";

// Thin, uniform wrappers around the REST endpoints. Every list-style resource
// shares the same shape: list(params), create(data), update(id, data), remove(id).
const makeResource = (path) => ({
  list: (params) => api.get(path, { params }).then((r) => r.data),
  get: (id) => api.get(`${path}/${id}`).then((r) => r.data),
  create: (data) => api.post(path, data).then((r) => r.data),
  update: (id, data) => api.put(`${path}/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`${path}/${id}`).then((r) => r.data),
});

export const WorkersAPI = {
  ...makeResource("/workers"),
  history: (id, params) => api.get(`/workers/${id}/history`, { params }).then((r) => r.data),
};

export const SuppliersAPI = {
  ...makeResource("/suppliers"),
  history: (id, params) => api.get(`/suppliers/${id}/history`, { params }).then((r) => r.data),
};

export const ProductionAPI = {
  ...makeResource("/production"),
  save: (data) => api.post("/production", data).then((r) => r.data), // upsert by date
  byDate: (date) => api.get(`/production/date/${date}`).then((r) => r.data),
};

export const WorkerPaymentsAPI = makeResource("/worker-payments");
export const OtherPaymentsAPI = makeResource("/payments");
export const RawMaterialsAPI = makeResource("/raw-materials");
export const BillsAPI = makeResource("/bills");
export const SalesAPI = makeResource("/sales");

export const ReportsAPI = {
  daily: (date) => api.get(`/reports/daily/${date}`).then((r) => r.data),
  monthly: (year, month) => api.get(`/reports/monthly/${year}/${month}`).then((r) => r.data),
  range: (from, to) => api.get(`/reports/range`, { params: { from, to } }).then((r) => r.data),
};

export const DashboardAPI = {
  daily: (date) => api.get(`/dashboard/daily/${date}`).then((r) => r.data),
};