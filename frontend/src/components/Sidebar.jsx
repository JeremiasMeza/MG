import React from 'react'
import { NavLink } from 'react-router-dom'

function Sidebar({ user, onLogout }) {
  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/inventario', label: 'Inventario' },
    { to: '/ventas', label: 'Ventas' },
    { to: '/reportes', label: 'Reportes' },
    { to: '/cotizaciones', label: 'Cotizaciones' },
  ]

  return (
    <div className="flex flex-col h-full w-64 bg-slate-900 text-white shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-blue-400 tracking-wide">
          Mueblerías George
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg transition-all duration-200 hover:bg-slate-800 hover:scale-105 hover:shadow-md ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg border-l-4 border-blue-400' 
                  : 'text-slate-300 hover:text-white'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-700 bg-slate-800/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">
              {user?.username || 'Usuario'}
            </p>
            <p className="text-xs text-slate-400">Administrador</p>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

export default Sidebar