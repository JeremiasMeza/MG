import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

function Sidebar({ user, onLogout }) {
  const [openSubmenu, setOpenSubmenu] = useState(null)
  const location = useLocation()

  // Función para verificar si el enlace principal está activo
  const isMainLinkActive = (link) => {
    if (!link.submenus) {
      return location.pathname === link.to
    }
    // Para enlaces con submenús, verificar si la ruta actual empieza con el path base
    return location.pathname.startsWith(link.to)
  }

  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { 
      to: '/inventario', 
      label: 'Inventario',
      submenus: [
        { to: '/inventario', label: 'Productos' },
        { to: '/inventario/categorias', label: 'Categorías' }
      ]
    },
    { to: '/ventas', label: 'Ventas' },
    { 
      to: '/reportes', 
      label: 'Reportes',
      submenus: [
        { to: '/reportes/ventas', label: 'Reporte de Ventas' },
        { to: '/reportes/inventario', label: 'Reporte de Inventario' },
        { to: '/reportes/financiero', label: 'Reporte Financiero' }
      ]
    },
    { to: '/cotizaciones', label: 'Cotizaciones' },
  ]

  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index)
  }

  return (
    <div className="flex flex-col h-full w-64 bg-slate-900 text-white shadow-xl">
      {/* Header */}
      <div className="h-20 p-6 border-b border-slate-700 flex items-center justify-center">
        <img src="../images/logo.png" alt="Mueblerías George" className="w-30 h-30 object-contain" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link, index) => (
          <div key={link.to}>
            {/* Enlace principal */}
            <div className="flex items-center">
              <NavLink
                to={link.to}
                onClick={(e) => {
                  if (link.submenus) {
                    // No prevenir la navegación, permitir ir al enlace principal
                    toggleSubmenu(index)
                  }
                }}
                className={() =>
                  `block px-4 py-3 rounded-lg transition-all duration-200 hover:bg-slate-800 hover:scale-105 hover:shadow-md flex-1 ${
                    isMainLinkActive(link)
                      ? 'bg-blue-600 text-white shadow-lg border-l-4 border-blue-400' 
                      : 'text-slate-300 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center justify-between">
                  <span>{link.label}</span>
                  {link.submenus && (
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openSubmenu === index ? 'rotate-180' : ''
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </NavLink>
            </div>

            {/* Submenús */}
            {link.submenus && openSubmenu === index && (
              <div className="ml-4 mt-2 space-y-1 border-l-2 border-slate-700 pl-4">
                {link.submenus.map((submenu) => (
                  <NavLink
                    key={submenu.to}
                    to={submenu.to}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm transition-all duration-200 hover:bg-slate-800 ${
                        isActive 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'text-slate-400 hover:text-white'
                      }`
                    }
                  >
                    {submenu.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
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