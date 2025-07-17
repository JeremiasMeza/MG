import { useState, useEffect } from 'react'
import ProductCard from '@components/Ventas/ProductCard.jsx'
import ProductRow from '@components/Ventas/ProductRow.jsx'
import Pagination from '@components/Ventas/Pagination.jsx'
import QuoteSummary from '@components/Cotizaciones/QuoteSummary.jsx'

const PER_PAGE_GRID = 12
const PER_PAGE_LIST = 15

function Cotizaciones() {
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('')
  const [qtyMap, setQtyMap] = useState({})
  const [cart, setCart] = useState([])
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState('grid')
  const [quoteInfo, setQuoteInfo] = useState({
    client_name: '',
    client_rut: '',
    client_email: '',
  })
  const [showQuotes, setShowQuotes] = useState(false)
  const [quotes, setQuotes] = useState([])
  const [pdfUrl, setPdfUrl] = useState('')

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
  }, [])

  useEffect(() => {
    setPage(1)
  }, [query, categoryFilter, viewMode])

  useEffect(() => {
    if (!showQuotes) return
    const token = localStorage.getItem('access')
    const headers = { Authorization: `Bearer ${token}` }
    fetch('http://192.168.1.52:8000/api/quotes/', { headers })
      .then((r) => r.json())
      .then(setQuotes)
      .catch((e) => console.error(e))
  }, [showQuotes])

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

  const handleGenerate = async () => {
    if (cart.length === 0) return
    const token = localStorage.getItem('access')
    const payload = {
      ...quoteInfo,
      details: cart.map((item) => ({ product_id: item.id, quantity: item.quantity })),
    }
    try {
      const resp = await fetch('http://192.168.1.52:8000/api/quotes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      if (!resp.ok) throw new Error('Error al generar cotización')
      const data = await resp.json()
      setCart([])
      setQtyMap({})
      setQuoteInfo({ client_name: '', client_rut: '', client_email: '' })
      const pdfResp = await fetch(`http://192.168.1.52:8000/api/quotes/${data.id}/export/`, { headers: { Authorization: `Bearer ${token}` } })
      const pdfData = await pdfResp.json()
      setPdfUrl(pdfData.pdf_url)
      setShowQuotes(true)
      setQuotes((prev) => [data, ...prev])
    } catch (err) {
      alert(err.message)
    }
  }

  const openQuote = async (id) => {
    const token = localStorage.getItem('access')
    try {
      const resp = await fetch(`http://192.168.1.52:8000/api/quotes/${id}/export/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!resp.ok) throw new Error('Error al cargar cotización')
      const data = await resp.json()
      setPdfUrl(data.pdf_url)
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-92% container mx-auto px-1 py-2">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          <div className="xl:col-span-4">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex flex-col lg:flex-row gap-3 mb-4">
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
                <span className="ml-auto">Página {page} de {pageCount}</span>
              </div>

              <div className="max-h-[65vh] overflow-y-auto">
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
                    <p className="text-gray-400 text-xs mt-1">Intenta cambiar los filtros o la búsqueda</p>
                  </div>
                )}
              </div>

              {pageCount > 1 && (
                <div className="mt-4 border-t pt-4">
                  <Pagination page={page} totalPages={pageCount} onPageChange={setPage} />
                </div>
              )}
            </div>
          </div>

          <div className="xl:col-span-1">
            <div className="sticky top-4">
              <QuoteSummary
                cart={cart}
                onRemove={handleRemove}
                quoteInfo={quoteInfo}
                onQuoteInfoChange={setQuoteInfo}
                onFinish={handleGenerate}
                onShowQuotes={() => setShowQuotes(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {showQuotes && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-lg">Cotizaciones</h3>
              <button onClick={() => setShowQuotes(false)} className="px-2 py-1 bg-red-500 text-white rounded">
                Cerrar
              </button>
            </div>
            <div className="flex flex-1 gap-4 overflow-hidden">
              <div className="w-1/3 overflow-y-auto border-r pr-2">
                <ul className="space-y-1">
                  {quotes.map((q) => (
                    <li
                      key={q.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                      onClick={() => openQuote(q.id)}
                    >
                      #{q.id} - {q.client_name}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1">
                {pdfUrl ? (
                  <iframe src={pdfUrl} className="w-full h-full" title="Cotizacion" />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    Selecciona una cotización
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cotizaciones
