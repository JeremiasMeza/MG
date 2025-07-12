import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Inventario', path: '/inventory' },
    { name: 'Carrito', path: '/cart' },
    { name: 'Configuración', path: '/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-center">
          <div className="text-xl font-bold">USUARIO</div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `block px-4 py-2 rounded hover:bg-gray-200 ${
                  isActive ? 'bg-blue-600 text-white' : 'text-gray-700'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="m-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Cerrar Sesión
        </button>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
};

export default DashboardLayout;
