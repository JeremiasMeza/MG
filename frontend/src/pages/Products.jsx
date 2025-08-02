import { useState, useEffect } from 'react'
import InventoryRow from '@components/Inventario/InventoryRow.jsx'
import ProductFormModal from '@components/Inventario/ProductFormModal.jsx'
import { API_BASE, authHeaders } from '../api.js'
import { fetchAll } from '../api/productos';

function Productos() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [onlyLow, setOnlyLow] = useState(false)
  const [editing, setEditing] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    setLoading(true)
    Promise.all([
      fetchAll('products/'),
      fetch(`${API_BASE}/categories/`, {
        headers: authHeaders(),
      }).then((r) => r.json()),
    ])
      .then(([prods, cats]) => {
        setProducts(prods)
        setCategories(cats)
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filtered = products.filter(
    (p) =>
      (
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.barcode || '').toLowerCase().includes(query.toLowerCase())
      ) &&
      (categoryFilter === '' || p.category === parseInt(categoryFilter)) &&
      (!onlyLow || p.stock <= p.stock_minimum)
  )

  const handleSave = async (data) => {
    try {
      const resp = await fetch(
        editing ? `${API_BASE}/products/${editing.id}/` : `${API_BASE}/products/`,
        {
          method: editing ? 'PUT' : 'POST',
          headers: authHeaders(),
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
          `${API_BASE}/products/${product.id}/`,
          { method: 'DELETE', headers: authHeaders() }
        )
      if (!resp.ok) throw new Error('Error al eliminar')
      fetchData()
    } catch (err) {
      alert(err.message)
    }
  }

  const lowStockCount = products.filter(p => p.stock <= p.stock_minimum).length

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 overflow-hidden">
      {/* Contenedor principal con altura de viewport completa */}
      <div className="h-full max-w-full mx-auto">
        {/* Contenedor principal del inventario */}
        <div className="h-full flex flex-col">
          
          {/* Sección principal de inventario */}
          <div className="flex-1 min-h-0">
            <div className="bg-white rounded-xl shadow-lg h-full flex flex-col overflow-hidden">
              
              {/* Header con título y estadísticas - altura fija */}
              <div className="flex-shrink-0 p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">Productos/Inventario</h1>
                    <p className="text-gray-600 text-sm mt-1">Gestión de productos y stock</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 px-3 py-2 rounded-lg">
                      <span className="text-xs text-blue-600">Total: </span>
                      <span className="font-semibold text-blue-700">{products.length}</span>
                    </div>
                    {lowStockCount > 0 && (
                      <div className="bg-red-50 px-3 py-2 rounded-lg">
                        <span className="text-xs text-red-600">Stock bajo: </span>
                        <span className="font-semibold text-red-700">{lowStockCount}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Filtros y Búsqueda */}
                <div className="flex flex-col lg:flex-row gap-3 mb-3">
                  {/* Búsqueda */}
                  <div className="flex-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Buscar producto
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Buscar por nombre o código de barras..."
                        className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm text-sm"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Selector de categoría */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Categoría
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm text-sm"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="">Todas las categorías</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Checkbox y botón */}
                  <div className="flex items-end gap-2">
                    <div className="flex items-center h-[34px] px-3 bg-gray-50 rounded-lg border border-gray-300">
                      <input
                        id="low"
                        type="checkbox"
                        checked={onlyLow}
                        onChange={(e) => setOnlyLow(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="low" className="ml-2 text-xs font-medium text-gray-700">
                        Stock bajo
                      </label>
                    </div>
                    
                    <button
                      onClick={() => {
                        setEditing(null)
                        setModalOpen(true)
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm text-sm h-[34px]"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Nuevo
                    </button>
                  </div>
                </div>

                {/* Barra de herramientas */}
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>
                    {filtered.length} producto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
                  </span>
                  {(query || categoryFilter || onlyLow) && (
                    <button
                      onClick={() => {
                        setQuery('')
                        setCategoryFilter('')
                        setOnlyLow(false)
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>
              </div>
              
              {/* Área de productos - altura flexible con scroll */}
              <div className="flex-1 min-h-0 p-4 pt-3">
                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="flex items-center gap-3 text-gray-600">
                      <svg className="animate-spin w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Cargando productos...</span>
                    </div>
                  </div>
                ) : filtered.length > 0 ? (
                  <div className="h-full overflow-y-auto">
                    <div className="space-y-2 pb-2">
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
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="text-gray-400 mb-3">
                      <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-base mb-2">No se encontraron productos</p>
                    <p className="text-gray-400 text-xs mb-4">
                      {query || categoryFilter || onlyLow 
                        ? 'Intenta ajustar los filtros de búsqueda' 
                        : 'Comienza agregando tu primer producto'}
                    </p>
                    {!query && !categoryFilter && !onlyLow && (
                      <button
                        onClick={() => {
                          setEditing(null)
                          setModalOpen(true)
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Agregar producto
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
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

export default Productos