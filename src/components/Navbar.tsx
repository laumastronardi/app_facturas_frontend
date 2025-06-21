import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Invoices', to: '/' },
  { label: 'New Invoice', to: '/invoices/new' },
  { label: 'Suppliers', to: '/suppliers' },
];

export default function Navbar() {
  return (
    <nav className="bg-brand-black border-b border-neutral-800 px-6 py-4 flex gap-4 items-center text-sm text-brand-gray">
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
    </nav>
  );
}
