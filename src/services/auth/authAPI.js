//This file centralizes all API calls.

const API_URL_AUTH =import.meta.env.VITE_API_URL_AUTH || 'http://127.0.0.1:5000/api/auth';

export async function loginRequest(credentials) {
  const res = await fetch(`${API_URL_AUTH}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
}

export async function registerRequest(userData) {
  const res = await fetch(`${API_URL_AUTH}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;
}

export async function refreshTokenRequest(refreshToken) {
  const res = await fetch(`${API_URL_AUTH}/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Token refresh failed');
  return data;
}

export async function getProfileRequest(token) {
  const res = await fetch(`${API_URL_AUTH}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Profile fetch failed');
  return data;
}
