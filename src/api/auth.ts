export interface User {
  id: number;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

const API_URL = import.meta.env.VITE_API_URL || '';

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Login failed');
  }
  
  const { user, access_token } = await res.json();
  
  if (!user || !access_token) {
    throw new Error('Invalid response from server');
  }
  
  localStorage.setItem('token', access_token);
  return user as User;
};

export const logout = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
  localStorage.removeItem('token');
};

export const getToken = () => localStorage.getItem('token');

export const isAuthenticated = () => !!getToken();

export const getProfile = async (): Promise<User> => {
  const token = getToken();
  if (!token) throw new Error('No token');
  
  const res = await fetch(`${API_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  
  if (!res.ok) {
    localStorage.removeItem('token');
    if (res.status === 401) {
      throw new Error('Token expired or invalid');
    }
    throw new Error('Failed to get profile');
  }

  // Solo intentar parsear JSON si hay contenido
  const text = await res.text();
  if (!text) {
    throw new Error('Empty response from profile endpoint');
  }

  return JSON.parse(text);
}; 