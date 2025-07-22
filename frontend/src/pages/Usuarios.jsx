import { useState, useEffect } from 'react'
import UserFormModal from '@components/Usuarios/UserFormModal.jsx'

// Componente UserRow mejorado siguiendo el mismo patrón
function UserRow({ user, onEdit, onDelete }) {
  const isAdmin = user.role === 'admin'

  return (
    <div className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="flex items-center p-4 space-x-4">
        {/* Badge de administrador */}
        {isAdmin && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10 shadow-md">
            Admin
          </div>
        )}

        {/* Avatar con icono de usuario */}
        <div className="relative w-16 h-16 flex-shrink-0 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
          <svg className="w-8 h-8 text-indigo-600 transition-transform duration-500 ease-out group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
        </div>

        {/* Información del usuario expandida */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-sm text-gray-900 leading-tight">
              {user.username}
            </h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Email si está disponible */}
              {user.email && (
                <span className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-0.5 rounded">
                  {user.email}
                </span>
              )}
              
              {/* Indicador de rol mejorado */}
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500">Rol:</span>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  isAdmin
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                    isAdmin
                      ? 'bg-blue-500'
                      : 'bg-green-500'
                  }`} />
                  {isAdmin ? 'Administrador' : 'Recepcionista'}
                </div>
              </div>

              {/* Estado del usuario */}
              <div className="flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                <div className="w-1.5 h-1.5 rounded-full mr-1 bg-green-500" />
                Activo
              </div>
            </div>

            {/* Información adicional */}
            <div className="text-right">
              <div className="text-sm font-medium text-gray-600">
                Usuario
              </div>
              <div className="text-xs text-gray-500">ID: {user.id}</div>
            </div>
          </div>
        </div>

        {/* Controles de acción mejorados */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={() => onEdit(user)}
            className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 transform bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="hidden sm:inline">Editar</span>
          </button>
          
          <button
            onClick={() => onDelete(user)}
            className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 transform bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="hidden sm:inline">Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  )
}

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
    <div className="p-6 space-y-6 h-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header mejorado */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-lg p-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Usuarios</h2>
          <p className="text-gray-600 mt-1">Gestiona los usuarios del sistema</p>
        </div>
        <button
          onClick={() => {
            setEditing(null)
            setModalOpen(true)
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* Lista de usuarios mejorada */}
      <div className="space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {users.length === 0 ? (
          <div className="flex items-center justify-center py-12 bg-white rounded-xl shadow-lg">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay usuarios</h3>
              <p className="text-gray-500">Comienza agregando tu primer usuario al sistema.</p>
            </div>
          </div>
        ) : (
          users.map((u) => (
            <UserRow 
              key={u.id} 
              user={u} 
              onEdit={(user) => {
                setEditing(user)
                setModalOpen(true)
              }}
              onDelete={handleDelete}
            />
          ))
        )}
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