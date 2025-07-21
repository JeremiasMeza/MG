import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

function Sidebar({ user, onLogout }) {
  const [openSubmenu, setOpenSubmenu] = useState(null)
  const location = useLocation()

  // Auto-abrir el submenú si estamos en una ruta que pertenece a él
  useEffect(() => {
    const currentPath = location.pathname
    links.forEach((link, index) => {
      if (link.submenus && currentPath.startsWith(link.to) && currentPath !== link.to) {
        setOpenSubmenu(index)
      }
    })
  }, [location.pathname])

  // Función para verificar si el enlace principal está activo
  const isMainLinkActive = (link) => {
    if (!link.submenus) {
      return location.pathname === link.to
    }
    return location.pathname.startsWith(link.to)
  }

  // Función para verificar si algún submenú está activo
  const hasActiveSubmenu = (link) => {
    if (!link.submenus) return false
    return link.submenus.some(submenu => location.pathname === submenu.to)
  }

  const allLinks = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
        </svg>
      )
    },
    {
      to: '/inventario',
      label: 'Inventario',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9l3-3 3 3" />
        </svg>
      ),
      submenus: [
        {
          to: '/inventario/productos',
          label: 'Productos',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          )
        },
        {
          to: '/inventario/categorias',
          label: 'Categorías',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          )
        }
      ]
    },
    { 
      to: '/ventas', 
      label: 'Ventas',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    { 
      to: '/reportes', 
      label: 'Reportes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      submenus: [
        { 
          to: '/reportes/ventas', 
          label: 'Reporte de Ventas',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          )
        },
        { 
          to: '/reportes/inventario', 
          label: 'Reporte de Inventario',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          )
        },
        { 
          to: '/reportes/financiero', 
          label: 'Reporte Financiero',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          )
        }
      ]
    },
    { 
      to: '/cotizaciones', 
      label: 'Cotizaciones',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
  ]
  const regularLinks = allLinks.filter((l) => ['inventario', 'ventas', 'cotizaciones'].some(p => l.to.startsWith('/' + p)))

  const links = user?.is_superuser ? [...allLinks] : [...regularLinks]
  if (user?.is_superuser) {
    links.push({
      to: '/usuarios',
      label: 'Usuarios',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    })
    links.push({
      to: '/import-export',
      label: 'Importar/Exportar',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m4-4H8" />
        </svg>
      )
    })
  }

  const toggleSubmenu = (index, e) => {
    // Solo prevenir navegación si se hace click en la flecha
    if (e.target.closest('.submenu-toggle')) {
      e.preventDefault()
      e.stopPropagation()
      setOpenSubmenu(openSubmenu === index ? null : index)
    }
  }

  return (
    <div className="flex flex-col h-full w-64 bg-slate-900 text-white shadow-xl">
      {/* Header */}
      <div className="h-20 p-6 border-b border-slate-700 flex items-center justify-center">
        <img 
          src="../images/logo.png" 
          alt="Mueblerías George" 
          className="w-30 h-30 object-contain transition-transform duration-200 hover:scale-105" 
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
        {links.map((link, index) => (
          <div key={link.to} className="relative">
            {/* Enlace principal */}
            <div className="flex items-center relative">
              <NavLink
                to={link.to}
                onClick={(e) => toggleSubmenu(index, e)}
                className={() => {
                  const isActive = isMainLinkActive(link)
                  const hasActiveSub = hasActiveSubmenu(link)
                  return `group relative block px-4 py-3 rounded-lg transition-all duration-200 hover:bg-slate-800 hover:scale-[1.02] hover:shadow-lg flex-1 ${
                    isActive || hasActiveSub
                      ? 'bg-blue-600 text-white shadow-lg border-l-4 border-blue-400 scale-[1.02]' 
                      : 'text-slate-300 hover:text-white'
                  }`
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="transition-colors duration-200">
                      {link.icon}
                    </span>
                    <span className="font-medium">{link.label}</span>
                  </div>
                  {link.submenus && (
                    <button
                      className="submenu-toggle p-1 hover:bg-black/20 rounded transition-colors duration-200"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setOpenSubmenu(openSubmenu === index ? null : index)
                      }}
                    >
                      <svg 
                        className={`w-4 h-4 transition-transform duration-300 ${
                          openSubmenu === index ? 'rotate-180' : ''
                        }`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>
              </NavLink>
            </div>

            {/* Submenús con animación */}
            {link.submenus && (
              <div className={`overflow-hidden transition-all duration-300 ${
                openSubmenu === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="ml-4 mt-2 space-y-1 border-l-2 border-slate-700 pl-4">
                  {link.submenus.map((submenu, subIndex) => (
                    <NavLink
                      key={submenu.to}
                      to={submenu.to}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-slate-800 hover:translate-x-1 ${
                          isActive 
                            ? 'bg-blue-600 text-white shadow-md translate-x-1' 
                            : 'text-slate-400 hover:text-white'
                        }`
                      }
                      style={{
                        transitionDelay: `${subIndex * 50}ms`
                      }}
                    >
                      <span className="transition-colors duration-200">
                        {submenu.icon}
                      </span>
                      <span>{submenu.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3 p-2 rounded-lg hover:bg-slate-700/30 transition-colors duration-200">
          <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </span>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">
              {user?.username || 'Usuario'}
            </p>
            <p className="text-xs text-slate-400">
              {user?.is_superuser ? 'Super Administrador' : 'Recepcionista'}
            </p>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="group flex items-center gap-3 w-full px-3 py-2 text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 hover:scale-105"
        >
          <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium">Cerrar sesión</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
