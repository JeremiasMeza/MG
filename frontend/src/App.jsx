import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Inventario from './pages/Inventario.jsx'
import Productos from './pages/Productos.jsx'
import Ventas from './pages/Ventas.jsx'
import Reportes from './pages/Reportes.jsx'
import Categorias from './pages/Categorias.jsx'
import ReportesVentas from './pages/ReportesVentas.jsx'
import ReportesInventario from './pages/ReportesInventario.jsx'
import ReportesFinanciero from './pages/ReportesFinanciero.jsx'
import Cotizaciones from './pages/Cotizaciones.jsx'

function App() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('access') || '')

  const handleLogin = (u, t) => {
    setUser(u)
    setToken(t)
  }

  const handleLogout = () => {
    setUser(null)
    setToken('')
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
  }

  const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh')
    try {
      const resp = await fetch(
        'http://192.168.1.52:8000/api/auth/token/refresh/',
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/inventario/productos" element={<Productos />} />
          <Route path="/inventario/categorias" element={<Categorias />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/reportes/ventas" element={<ReportesVentas />} />
          <Route path="/reportes/inventario" element={<ReportesInventario />} />
          <Route path="/reportes/financiero" element={<ReportesFinanciero />} />
          <Route path="/cotizaciones" element={<Cotizaciones />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
