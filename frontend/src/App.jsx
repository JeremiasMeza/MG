import { useState } from 'react'
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

  if (!token) {
    return (
      <div className="p-4">
        <h1 className="text-2xl mb-4">Iniciar Sesión</h1>
        <Login onSuccess={handleLogin} />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout user={user} />}>
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
