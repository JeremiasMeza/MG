import { useState, useEffect } from 'react'
import InventoryRow from '@components/Inventario/InventoryRow.jsx'
import ProductFormModal from '@components/Inventario/ProductFormModal.jsx'

function Inventario() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [onlyLow, setOnlyLow] = useState(false)
  const [editing, setEditing] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const token = localStorage.getItem('access')
  const authHeaders = { Authorization: `Bearer ${token}` }

  const fetchData = () => {
    fetch('http://192.168.1.52:8000/api/products/', { headers: authHeaders })
      .then((r) => r.json())
      .then(setProducts)
      .catch((e) => console.error(e))
    fetch('http://192.168.1.52:8000/api/categories/', { headers: authHeaders })
      .then((r) => r.json())
      .then(setCategories)
      .catch((e) => console.error(e))
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) &&
      (categoryFilter === '' || p.category === parseInt(categoryFilter)) &&
      (!onlyLow || p.stock <= p.stock_minimum)
  )

  const handleSave = async (data) => {
    try {
      const resp = await fetch(
        editing
          ? `http://192.168.1.52:8000/api/products/${editing.id}/`
          : 'http://192.168.1.52:8000/api/products/',
        {
          method: editing ? 'PUT' : 'POST',
          headers: authHeaders,
          body: data,
        }
      )
      if (!resp.ok) throw new Error('Error al guardar')
      setModalOpen(false)
      setEditing(null)
      fetchData()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (product) => {
    if (!window.confirm('¿Eliminar producto?')) return
    try {
      const resp = await fetch(
        `http://192.168.1.52:8000/api/products/${product.id}/`,
        { method: 'DELETE', headers: authHeaders }
      )
      if (!resp.ok) throw new Error('Error al eliminar')
      fetchData()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-700 mb-1">Buscar</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Nombre del producto"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Categoría</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Todas</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center h-10 mt-5">
          <input
            id="low"
            type="checkbox"
            checked={onlyLow}
            onChange={(e) => setOnlyLow(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="low" className="text-sm">Bajo stock</label>
        </div>
        <button
          onClick={() => {
            setEditing(null)
            setModalOpen(true)
          }}
          className="h-10 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md"
        >
          Nuevo
        </button>
      </div>
      <div className="space-y-2">
        {filtered.map((p) => (
          <InventoryRow
            key={p.id}
            product={p}
            onEdit={(prod) => {
              setEditing(prod)
              setModalOpen(true)
            }}
            onDelete={handleDelete}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-8">No se encontraron productos</p>
        )}
      </div>
      <ProductFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        onSave={handleSave}
        product={editing}
        categories={categories}
      />
    </div>
  )
}

export default Inventario
