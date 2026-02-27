const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'x-api-key': API_KEY,
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });

  // DELETE 204 has no body
  if (res.status === 204) {
    return { ok: true, requestId: '', data: null };
  }

  const json = await res.json();
  if (json.success) return { ok: true, requestId: json.requestId, data: json.data };
  return { ok: false, requestId: json.requestId, error: json.error };
}

export const listWorkOrders = (query = {}) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== '') params.set(k, String(v));
  });
  const qs = params.toString();
  return request(`/api/workorders${qs ? `?${qs}` : ''}`);
};

export const getWorkOrder = (id) => request(`/api/workorders/${id}`);

export const createWorkOrder = (payload) =>
  request('/api/workorders', { method: 'POST', body: JSON.stringify(payload) });

export const updateWorkOrder = (id, payload) =>
  request(`/api/workorders/${id}`, { method: 'PUT', body: JSON.stringify(payload) });

export const changeStatus = (id, status) =>
  request(`/api/workorders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });

export const deleteWorkOrder = (id) =>
  request(`/api/workorders/${id}`, { method: 'DELETE' });

export const bulkUploadCsv = (file) => {
  const form = new FormData();
  form.append('file', file);
  return request('/api/workorders/bulk-upload', { method: 'POST', body: form });
};
