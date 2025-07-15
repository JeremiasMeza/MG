import React from 'react'
import { NavLink } from 'react-router-dom'

function Sidebar({ user }) {
  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/inventario', label: 'Inventario' },
    { to: '/ventas', label: 'Ventas' },
    { to: '/reportes', label: 'Reportes' },
    { to: '/cotizaciones', label: 'Cotizaciones' },
  ]

  return (
    <div className="flex flex-col h-full w-64 bg-gray-800 text-white">
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        Mueblerías George
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block px-2 py-1 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700 text-sm">
        {user?.username}
      </div>
    </div>
  )
}

export default Sidebar
