import { useState, useEffect, useCallback } from 'react';
import { login, logout, getProfile, isAuthenticated } from '../api/auth';
import type { User } from '../api/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para verificar la autenticación
  const checkAuth = useCallback(async () => {
    try {
      setError(null);
      
      // Verificar si hay un token válido
      if (isAuthenticated()) {
        // Intentar obtener el perfil del usuario
        const userProfile = await getProfile();
        setUser(userProfile);
      } else {
        // Si no hay token, asegurar que el estado esté limpio
        setUser(null);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setError(error instanceof Error ? error.message : 'Authentication error');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar autenticación al inicializar
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const user = await login(email, password);
      setUser(user);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
      setError(error instanceof Error ? error.message : 'Logout failed');
    } finally {
      // Siempre limpiar el estado del usuario
      setUser(null);
      setLoading(false);
    }
  };

  // Función para refrescar la autenticación
  const refreshAuth = useCallback(async () => {
    setLoading(true);
    await checkAuth();
  }, [checkAuth]);

  return {
    user,
    loading,
    error,
    login: handleLogin,
    logout: handleLogout,
    refreshAuth,
    isAuthenticated: !!user,
  };
}; 