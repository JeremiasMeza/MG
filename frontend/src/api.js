export const API_BASE = import.meta.env.VITE_API_BASE;

export function authHeaders() {
  const token = localStorage.getItem('access');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchAll(endpoint) {
  const items = [];
  let next = `${API_BASE}/${endpoint}`;
  while (next) {
    const resp = await fetch(next, { headers: authHeaders() });
    const data = await resp.json();
    if (Array.isArray(data)) {
      items.push(...data);
      break;
    }
    items.push(...(data.results || []));
    next = data.next;
  }
  return items;
}
