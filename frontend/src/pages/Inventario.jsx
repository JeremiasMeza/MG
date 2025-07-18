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
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('access')
  const authHeaders = { Authorization: `Bearer ${token}` }

  const fetchAllProducts = async (url) => {
    const items = []
    let next = url
    while (next) {
      const resp = await fetch(next, { headers: authHeaders })
      const data = await resp.json()
      if (Array.isArray(data)) {
        items.push(...data)
        break
      }
      if (data.results) {
        items.push(...data.results)
        next = data.next
      } else {
        items.push(...data)
        next = null
      }
    }
    return items
  }

  const fetchData = () => {
    setLoading(true)
    Promise.all([
      fetchAllProducts('http://192.168.1.52:8000/api/products/'),
      fetch('http://192.168.1.52:8000/api/categories/', {
        headers: authHeaders,
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

  const lowStockCount = products.filter(p => p.stock <= p.stock_minimum).length

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Inventario</h1>
            <p className="text-gray-600 mt-1">Gestión de productos y stock</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-sm text-gray-600">Total productos: </span>
              <span className="font-semibold text-gray-800">{products.length}</span>
            </div>
            {lowStockCount > 0 && (
              <div className="bg-red-50 px-4 py-2 rounded-lg">
                <span className="text-sm text-red-600">Stock bajo: </span>
                <span className="font-semibold text-red-700">{lowStockCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar producto
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nombre del producto..."
                />
              </div>
            </div>

            <div className="min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Todas las categorías</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <div className="flex items-center h-12 px-4 bg-gray-50 rounded-lg">
                <input
                  id="low"
                  type="checkbox"
                  checked={onlyLow}
                  onChange={(e) => setOnlyLow(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="low" className="ml-2 text-sm font-medium text-gray-700">
                  Solo stock bajo
                </label>
              </div>
            </div>

            <button
              onClick={() => {
                setEditing(null)
                setModalOpen(true)
              }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nuevo Producto
            </button>
          </div>
        </div>
      </div>

      {/* Content - Contenedor con altura fija */}
      <div className="bg-white rounded-xl shadow-sm h-[600px] flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center flex-1">
            <div className="flex items-center gap-3">
              <svg className="animate-spin w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-gray-600">Cargando productos...</span>
            </div>
          </div>
        ) : (
          <>
            {filtered.length > 0 ? (
              <>
                {/* Table Header - Fijo */}
                <div className="px-6 py-4 bg-gray-50 rounded-t-xl flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Productos ({filtered.length})
                    </h3>
                    {query || categoryFilter || onlyLow ? (
                      <button
                        onClick={() => {
                          setQuery('')
                          setCategoryFilter('')
                          setOnlyLow(false)
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Limpiar filtros
                      </button>
                    ) : null}
                  </div>
                </div>

                {/* Products List - Scrollable */}
                <div className="flex-1 overflow-y-auto px-6">
                  <div className="divide-y divide-gray-200">
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
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center px-6 py-16">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    No se encontraron productos
                  </h3>
                  <p className="text-gray-600 mb-6">
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
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Agregar producto
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
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

export default Inventario