import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getToken } from '../api/auth';

export const AuthPersistence: React.FC = () => {
  const { refreshAuth } = useAuth();

  useEffect(() => {
    // Función para manejar cambios en el localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        // Si el token cambió, refrescar la autenticación
        refreshAuth();
      }
    };

    // Función para verificar si el token existe al cargar la página
    const checkTokenOnLoad = () => {
      const token = getToken();
      if (token) {
        refreshAuth();
      }
    };

    // Verificar al cargar la página
    checkTokenOnLoad();

    // Escuchar cambios en el localStorage (para pestañas múltiples)
    window.addEventListener('storage', handleStorageChange);

    // Escuchar el evento beforeunload para asegurar que el estado se mantenga
    const handleBeforeUnload = () => {
      // No hacer nada específico, solo asegurar que el estado se mantenga
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [refreshAuth]);

  return null; // Este componente no renderiza nada
}; 