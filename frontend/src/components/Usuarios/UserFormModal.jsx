import { useState, useEffect } from 'react'

function UserFormModal({ open, onClose, onSave, user }) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'recepcionist',
    is_active: true,
  })

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || '',
        email: user.email || '',
        password: '',
        role: user.role || 'recepcionist',
        is_active: user.is_active,
      })
    } else {
      setForm({ username: '', email: '', password: '', role: 'recepcionist', is_active: true })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      username: form.username,
      email: form.email,
      role: form.role,
      is_active: form.is_active,
    }
    if (form.password) data.password = form.password
    onSave(data)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">{user ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
          <button
            type="button"
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 text-white rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cerrar
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 p-6 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700">Usuario</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Correo</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder={user ? 'Dejar en blanco para mantener' : ''}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="admin">Administrador</option>
              <option value="recepcionist">Recepcionista</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              Activo
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserFormModal
