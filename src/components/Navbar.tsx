import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Invoices', to: '/invoices' },
  { label: 'New Invoice', to: '/invoices/new' },
  { label: 'Suppliers', to: '/suppliers' },
];

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-brand-black border-b border-neutral-800 px-6 py-4 flex gap-4 items-center justify-between text-sm text-brand-gray">
      <div className="flex gap-4 items-center">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `px-3 py-1 rounded-md hover:text-white hover:bg-brand-orange/20 transition ${
                isActive ? 'text-white bg-brand-orange/30 font-semibold' : ''
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
      
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-brand-gray">
            {user.name || user.email}
          </span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded-md hover:text-white hover:bg-red-600/20 transition text-red-400"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </nav>
  );
}
