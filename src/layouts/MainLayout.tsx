import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { AuthDebug } from '../components/AuthDebug';

export default function MainLayout() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black text-brand-gray">
      <Navbar />
      <Outlet />
      <AuthDebug />
    </div>
  );
}
