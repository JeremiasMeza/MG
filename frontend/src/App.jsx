import { useState } from 'react'
import Login from './Login.jsx'

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
    <div className="p-4">
      <h1 className="text-2xl">Bienvenido, {user?.username}</h1>
      <p>Rol: {user?.role}</p>
    </div>
  )
}

export default App

