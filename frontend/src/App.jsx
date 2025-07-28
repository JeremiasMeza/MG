import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import { API_BASE } from './api.js'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Inventory from './pages/Inventory.jsx'
import Products from './pages/Products.jsx'
import Sales from './pages/Sales.jsx'
import Reports from './pages/Reports.jsx'
import Categories from './pages/Categories.jsx'
import SalesReports from './pages/SalesReports.jsx'
import InventoryReports from './pages/InventoryReports.jsx'
import FinancialReports from './pages/FinancialReports.jsx'
import Quotes from './pages/Quotes.jsx'
import Users from './pages/Users.jsx'
import ImportExport from './pages/ImportExport.jsx'

function RequireSuperuser({ children, user }) {
  if (!user?.is_superuser) {
    return <Navigate to="/inventario" replace />
  }
  return children
}

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState(localStorage.getItem('access') || '')

  const handleLogin = (u, t) => {
    setUser(u)
    setToken(t)
    localStorage.setItem('user', JSON.stringify(u))
  }

  const handleLogout = () => {
    setUser(null)
    setToken('')
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('user')
  }

  const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh')
    try {
      const resp = await fetch(
        `${API_BASE}/auth/token/refresh/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh }),
        }
      )
      if (!resp.ok) throw new Error('')
      const data = await resp.json()
      localStorage.setItem('access', data.access)
      setToken(data.access)
    } catch {
      handleLogout()
    }
  }

  useEffect(() => {
    if (!token) return
    const decode = (tok) => {
      try {
        return JSON.parse(atob(tok.split('.')[1]))
      } catch {
        return null
      }
    }
    const payload = decode(token)
    if (!payload || !payload.exp) return
    const expiresIn = payload.exp * 1000 - Date.now()
    if (expiresIn <= 0) {
      handleLogout()
      return
    }

    const promptId = setTimeout(async () => {
      const keep = window.confirm('¿Deseas continuar en la sesión?')
      if (keep) {
        await refreshToken()
      } else {
        handleLogout()
      }
    }, Math.max(0, expiresIn - 60000))

    const logoutId = setTimeout(() => {
      handleLogout()
    }, expiresIn)

    return () => {
      clearTimeout(promptId)
      clearTimeout(logoutId)
    }
  }, [token])

  if (!token) {
    return (
      <div className="">
        <Login onSuccess={handleLogin} />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout user={user} onLogout={handleLogout} />}> 
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <RequireSuperuser user={user}>
                <Dashboard />
              </RequireSuperuser>
            }
          />
          <Route path="/inventario" element={<Inventory />} />
          <Route path="/inventario/productos" element={<Products />} />
          <Route path="/inventario/categorias" element={<Categories />} />
          <Route path="/ventas" element={<Sales />} />

          <Route
            path="/reportes"
            element={
              <RequireSuperuser user={user}>
                <Reports />
              </RequireSuperuser>
            }
          />
          <Route
            path="/reportes/ventas"
            element={
              <RequireSuperuser user={user}>
                <SalesReports />
              </RequireSuperuser>
            }
          />
          <Route
            path="/reportes/inventario"
            element={
              <RequireSuperuser user={user}>
                <InventoryReports />
              </RequireSuperuser>
            }
          />
          <Route
            path="/reportes/financiero"
            element={
              <RequireSuperuser user={user}>
                <FinancialReports />
              </RequireSuperuser>
            }
          />
            <Route path="/cotizaciones" element={<Quotes />} />
          <Route
            path="/usuarios"
            element={
              <RequireSuperuser user={user}>
                  <Users />
              </RequireSuperuser>
            }
          />
          <Route
            path="/import-export"
            element={
              <RequireSuperuser user={user}>
                <ImportExport />
              </RequireSuperuser>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
