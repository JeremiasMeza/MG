// src/pages/Ventas.jsx
import { useState, useEffect } from 'react'
import ProductCard from '@components/ventas/ProductCard.jsx'
import ProductRow from '@components/ventas/ProductRow.jsx'
import CartSummary from '@components/ventas/CartSummary.jsx'
import Pagination from '@components/ventas/Pagination.jsx'

const PER_PAGE_GRID = 12
const PER_PAGE_LIST = 15

function Ventas() {
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('')
  const [qtyMap, setQtyMap] = useState({})
  const [cart, setCart] = useState([])
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState('grid')
  const [saleInfo, setSaleInfo] = useState({
    client_first_name: '',
    client_last_name: '',
    client_rut: '',
    client_email: '',
    payment_method: '',
  })

  useEffect(() => {
    const token = localStorage.getItem('access')
    const headers = { Authorization: `Bearer ${token}` }
    fetch('http://192.168.1.52:8000/api/products/', { headers })
      .then((r) => r.json())
      .then(setProducts)
      .catch((e) => console.error(e))
    fetch('http://192.168.1.52:8000/api/categories/', { headers })
      .then((r) => r.json())
      .then(setCategories)
      .catch((e) => console.error(e))
    fetch('http://192.168.1.52:8000/api/payment-methods/', { headers })
      .then((r) => r.json())
      .then(setPaymentMethods)
      .catch((e) => console.error(e))
  }, [])

  useEffect(() => {
    setPage(1)
  }, [query, categoryFilter, viewMode])

  const filtered = products.filter(
    (p) =>
      (categoryFilter === '' || p.category === parseInt(categoryFilter)) &&
      (p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.barcode || '').toLowerCase().includes(query.toLowerCase()))
  )

  const perPage = viewMode === 'grid' ? PER_PAGE_GRID : PER_PAGE_LIST
  const pageCount = Math.ceil(filtered.length / perPage)
  const productsToShow = filtered.slice((page - 1) * perPage, page * perPage)

  const handleAdd = (product) => {
    const qty = qtyMap[product.id] || 1
    if (qty < 1 || qty > product.stock) return
    setCart((prev) => {
      const existing = prev.find((it) => it.id === product.id)
      if (existing) {
        const updatedQty = existing.quantity + qty
        if (updatedQty > product.stock) return prev
        return prev.map((it) =>
          it.id === product.id ? { ...it, quantity: updatedQty } : it
        )
      }
      return [...prev, { ...product, quantity: qty }]
    })
  }

  const handleQtyChange = (id, val) => {
    setQtyMap((prev) => ({ ...prev, [id]: val }))
  }

  const handleRemove = (id) => {
    setCart((prev) => prev.filter((it) => it.id !== id))
  }

  const handleFinishSale = async () => {
    if (cart.length === 0) return
    const token = localStorage.getItem('access')
    const payload = {
      ...saleInfo,
      payment_method: saleInfo.payment_method || null,
      details: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    }
    try {
      const resp = await fetch('http://192.168.1.52:8000/api/sales/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      if (!resp.ok) throw new Error('Error al registrar venta')
      alert('Venta registrada')
      setCart([])
      setQtyMap({})
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-92% container mx-auto px-1 py-2">
        {/* Contenido Principal */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          {/* Productos - 4 columnas */}
          <div className="xl:col-span-4">
            <div className="bg-white rounded-xl shadow-lg p-4">
              {/* Filtros y Búsqueda */}
              <div className="flex flex-col lg:flex-row gap-3 mb-4">
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
              </div>

              {/* Vista */}
              <div className="mb-4 flex items-center justify-between text-xs text-gray-600">
                <span>
                  {filtered.length} producto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-2 py-1 rounded-md border text-xs ${
                      viewMode === 'grid'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-300'
                    }`}
                  >
                    Cards
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-2 py-1 rounded-md border text-xs ${
                      viewMode === 'list'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-300'
                    }`}
                  >
                    Lista
                  </button>
                </div>
                <span className="ml-auto">
                  Página {page} de {pageCount}
                </span>
              </div>
              
              <div>
                {productsToShow.length > 0 ? (
                  viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3">
                      {productsToShow.map((p) => (
                        <ProductCard
                          key={p.id}
                          product={p}
                          quantity={qtyMap[p.id] || 1}
                          onQuantityChange={(val) => handleQtyChange(p.id, val)}
                          onAdd={() => handleAdd(p)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {productsToShow.map((p) => (
                        <ProductRow
                          key={p.id}
                          product={p}
                          quantity={qtyMap[p.id] || 1}
                          onQuantityChange={(val) => handleQtyChange(p.id, val)}
                          onAdd={() => handleAdd(p)}
                        />
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-3">
                      <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-base">No se encontraron productos</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Intenta cambiar los filtros o la búsqueda
                    </p>
                  </div>
                )}
              </div>

              {/* Paginación */}
              {pageCount > 1 && (
                <div className="mt-4 border-t pt-4">
                  <Pagination page={page} totalPages={pageCount} onPageChange={setPage} />
                </div>
              )}
            </div>
          </div>

          {/* Carrito - 1 columna */}
          <div className="xl:col-span-1">
            <div className="sticky top-4">
              <CartSummary
                cart={cart}
                onRemove={handleRemove}
                paymentMethods={paymentMethods}
                saleInfo={saleInfo}
                onSaleInfoChange={setSaleInfo}
                onFinish={handleFinishSale}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ventas
