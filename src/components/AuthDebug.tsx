import React from 'react';
import { useAuth } from '../context/AuthContext';
import { getToken, isAuthenticated } from '../api/auth';

export const AuthDebug: React.FC = () => {
  const { user, loading, isAuthenticated: contextIsAuthenticated, error } = useAuth();
  const token = getToken();
  const apiIsAuthenticated = isAuthenticated();

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="space-y-1">
        <div>Loading: {loading ? 'true' : 'false'}</div>
        <div>Token exists: {token ? 'true' : 'false'}</div>
        <div>API isAuthenticated: {apiIsAuthenticated ? 'true' : 'false'}</div>
        <div>Context isAuthenticated: {contextIsAuthenticated ? 'true' : 'false'}</div>
        <div>User: {user ? `${user.email} (${user.id})` : 'null'}</div>
        {error && <div className="text-red-400">Error: {error}</div>}
      </div>
    </div>
  );
}; 