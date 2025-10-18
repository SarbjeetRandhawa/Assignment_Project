// src/lib/api.ts
// Small client wrapper for backend endpoints. Uses NEXT_PUBLIC_API_URL env var.
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function signupAdmin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function loginAdmin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function uploadCSV(formData: FormData, token?: string) {
  const res = await fetch(`${API_BASE}/courses/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData
  });
  return res.json();
}

export async function searchCourses(q = '') {
  const url = new URL(`${API_BASE}/courses/search`);
  if (q) url.searchParams.set('q', q);
  const res = await fetch(url.toString());
  return res.json();
}

export async function getRecommendations(preferences: any, token?: string) {
  const res = await fetch(`${API_BASE}/recommendations`, {
    method:'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(preferences)
  });
  return res.json();
}
