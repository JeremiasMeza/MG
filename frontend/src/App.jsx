import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Inventario from './pages/Inventario.jsx'
import Ventas from './pages/Ventas.jsx'
import Reportes from './pages/Reportes.jsx'
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
    const id = setTimeout(() => {
      handleLogout()
    }, expiresIn)
    return () => clearTimeout(id)
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
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/cotizaciones" element={<Cotizaciones />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
