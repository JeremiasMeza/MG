import { useState, useEffect } from 'react'
import CategoryRow from '@components/Categorias/CategoryRow.jsx'
import CategoryFormModal from '@components/Categorias/CategoryFormModal.jsx'
import { API_BASE, authHeaders } from '../api.js'

function Categorias() {
  const [categories, setCategories] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const headers = { ...authHeaders(), 'Content-Type': 'application/json' }

  const fetchCategories = () => {
    fetch(`${API_BASE}/categories/`, { headers })
      .then((r) => r.json())
      .then(setCategories)
      .catch((e) => console.error(e))
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSave = async (data) => {
    try {
        const resp = await fetch(
          editing ? `${API_BASE}/categories/${editing.id}/` : `${API_BASE}/categories/`,
          {
            method: editing ? 'PUT' : 'POST',
            headers,
            body: JSON.stringify(data),
          }
        )
      if (!resp.ok) throw new Error('Error al guardar')
      setModalOpen(false)
      setEditing(null)
      fetchCategories()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (cat) => {
    if (!window.confirm('¿Eliminar categoría?')) return
    try {
        const resp = await fetch(`${API_BASE}/categories/${cat.id}/`, {
          method: 'DELETE',
          headers,
        })
      if (!resp.ok) throw new Error('Error al eliminar')
      fetchCategories()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="p-6 space-y-4 h-full bg-gray-50">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Categorías</h2>
        <button
          onClick={() => {
            setEditing(null)
            setModalOpen(true)
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Nueva Categoría
        </button>
      </div>

      <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 160px)' }}>
        {categories.map((cat) => (
          <CategoryRow key={cat.id} category={cat} onEdit={(c) => { setEditing(c); setModalOpen(true) }} onDelete={handleDelete} />
        ))}
      </div>

      <CategoryFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        onSave={handleSave}
        category={editing}
      />
    </div>
  )
}

export default Categorias
