import { useState, useEffect } from 'react'
import UserFormModal from '@components/Usuarios/UserFormModal.jsx'

function Usuarios() {
  const [users, setUsers] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const token = localStorage.getItem('access')

  const authHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const fetchUsers = () => {
    fetch('http://192.168.1.52:8000/api/users/', { headers: authHeaders })
      .then((r) => r.json())
      .then(setUsers)
      .catch((e) => console.error(e))
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSave = async (data) => {
    try {
      const resp = await fetch(
        editing ? `http://192.168.1.52:8000/api/users/${editing.id}/` : 'http://192.168.1.52:8000/api/users/',
        {
          method: editing ? 'PUT' : 'POST',
          headers: authHeaders,
          body: JSON.stringify(data),
        }
      )
      if (!resp.ok) throw new Error('Error al guardar')
      setModalOpen(false)
      setEditing(null)
      fetchUsers()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (u) => {
    if (!window.confirm('¿Eliminar usuario?')) return
    try {
      const resp = await fetch(`http://192.168.1.52:8000/api/users/${u.id}/`, {
        method: 'DELETE',
        headers: authHeaders,
      })
      if (!resp.ok) throw new Error('Error al eliminar')
      fetchUsers()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="p-6 space-y-4 h-full bg-gray-50">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Usuarios</h2>
        <button
          onClick={() => {
            setEditing(null)
            setModalOpen(true)
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Nuevo Usuario
        </button>
      </div>

      <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 160px)' }}>
        {users.map((u) => (
          <div key={u.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow">
            <div>
              <p className="font-medium text-gray-800">{u.username}</p>
              <p className="text-sm text-gray-500">{u.role === 'admin' ? 'Administrador' : 'Recepcionista'}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditing(u)
                  setModalOpen(true)
                }}
                className="px-3 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(u)}
                className="px-3 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <UserFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        onSave={handleSave}
        user={editing}
      />
    </div>
  )
}

export default Usuarios
