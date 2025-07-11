import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Invoices', to: '/invoices' },
  { label: 'New Invoice', to: '/invoices/new' },
  { label: 'Suppliers', to: '/suppliers' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-brand-black border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-brand-orange" />
            <span className="ml-2 text-xl font-bold text-white hidden sm:block">
              Facturas App
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive
                        ? 'text-white bg-brand-orange/30'
                        : 'text-brand-gray hover:text-white hover:bg-brand-orange/20'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Desktop User Menu */}
          {user && (
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6 space-x-4">
                <span className="text-brand-gray text-sm">
                  {user.name || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:text-white hover:bg-red-600/20 transition"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-brand-gray hover:text-white hover:bg-brand-orange/20 transition"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-brand-black border-t border-neutral-800">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition ${
                    isActive
                      ? 'text-white bg-brand-orange/30'
                      : 'text-brand-gray hover:text-white hover:bg-brand-orange/20'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            
            {user && (
              <div className="pt-4 pb-3 border-t border-neutral-800">
                <div className="flex items-center px-3">
                  <span className="text-brand-gray text-sm">
                    {user.name || user.email}
                  </span>
                </div>
                <div className="mt-3 px-3">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-white hover:bg-red-600/20 transition"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
