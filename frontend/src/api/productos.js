import { API_BASE, authHeaders } from '../api';

export async function fetchAll(endpoint) {
  const response = await fetch(`${API_BASE}/${endpoint}`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Error al obtener ${endpoint}: ${response.statusText}`);
  }

  return await response.json();
}
