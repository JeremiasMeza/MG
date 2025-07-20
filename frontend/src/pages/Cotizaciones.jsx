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
  const [quotesSearch, setQuotesSearch] = useState('')

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
    if (quoteInfo.client_name.trim() === '' || quoteInfo.client_rut.trim() === '') {
      alert('Debe ingresar nombre y RUT del cliente')
      return
    }
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
      const pdfResp = await fetch(`http://192.168.1.52:8000/api/quotes/${data.id}/export/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!pdfResp.ok) throw new Error('Error al generar PDF de cotización')
      const pdfData = await pdfResp.json()
      window.open(pdfData.pdf_url, '_blank')
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
      window.open(data.pdf_url, '_blank')
    } catch (err) {
      alert(err.message)
    }
  }

  const filteredQuotes = quotes.filter((q) =>
    q.id.toString().includes(quotesSearch) ||
    q.client_name.toLowerCase().includes(quotesSearch.toLowerCase()) ||
    (q.client_rut && q.client_rut.toLowerCase().includes(quotesSearch.toLowerCase()))
  )

  useEffect(() => {
    let buffer = ''
    let last = Date.now()
    const handler = (e) => {
      const active = document.activeElement
      if (active && ['INPUT', 'TEXTAREA'].includes(active.tagName)) return
      const now = Date.now()
      if (now - last > 100) buffer = ''
      if (e.key === 'Enter') {
        if (buffer) {
          const prod = products.find((p) => p.barcode === buffer)
          if (prod) handleAdd(prod)
        }
        buffer = ''
      } else {
        buffer += e.key
      }
      last = now
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [products])

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 overflow-hidden">
      {/* Contenedor principal con altura de viewport completa */}
      <div className="h-full max-w-full mx-auto">
        {/* Grid principal con altura calculada exacta */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 h-full">
          
          {/* Sección de Productos - 4 columnas */}
          <div className="xl:col-span-4 flex flex-col h-full min-h-0">
            <div className="bg-white rounded-xl shadow-lg h-full flex flex-col overflow-hidden">
              
              {/* Header con filtros - altura fija */}
              <div className="flex-shrink-0 p-4 border-b border-gray-100">
                {/* Filtros y Búsqueda */}
                <div className="flex flex-col lg:flex-row gap-3 mb-3">
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

                {/* Barra de herramientas */}
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>
                    {filtered.length} producto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-1 rounded-md border text-xs transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      Cards
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-3 py-1 rounded-md border text-xs transition-colors ${
                        viewMode === 'list'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      Lista
                    </button>
                  </div>
                  <span>
                    Página {page} de {pageCount}
                  </span>
                </div>
              </div>
              
              {/* Área de productos - altura flexible con scroll */}
              <div className="flex-1 min-h-0 p-4 pt-3">
                {productsToShow.length > 0 ? (
                  viewMode === 'grid' ? (
                    <div className="h-full overflow-y-auto">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 pb-2">
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
                    </div>
                  ) : (
                    <div className="h-full overflow-y-auto">
                      <div className="space-y-2 pb-2">
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
                    </div>
                  )
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center">
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

              {/* Footer con paginación - altura fija */}
              {pageCount > 1 && (
                <div className="flex-shrink-0 p-4 pt-2 border-t border-gray-100">
                  <Pagination page={page} totalPages={pageCount} onPageChange={setPage} />
                </div>
              )}
            </div>
          </div>

          {/* Sección del Resumen de Cotización - 1 columna */}
          <div className="xl:col-span-1 flex flex-col h-full min-h-0">
            <div className="bg-white rounded-xl shadow-lg h-full overflow-hidden">
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

      {/* Modal de cotizaciones - igual que antes */}
      {showQuotes && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">Cotizaciones Generadas</h3>
                <p className="text-blue-100 text-sm mt-1">
                  Total: {quotes.length} cotizacion{quotes.length !== 1 ? 'es' : ''}
                </p>
              </div>
              <button 
                onClick={() => setShowQuotes(false)} 
                className="bg-white/10 hover:bg-white/20 text-white rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cerrar
              </button>
            </div>

            {/* Buscador */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por número, nombre o RUT..."
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm text-sm"
                  value={quotesSearch}
                  onChange={(e) => setQuotesSearch(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Lista de cotizaciones */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {filteredQuotes.length > 0 ? (
                <div className="space-y-2">
                  {filteredQuotes.map((q) => (
                    <div
                      key={q.id}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 cursor-pointer transition-all duration-200 group"
                      onClick={() => openQuote(q.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              #{q.id}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(q.created_at || Date.now()).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          
                          <h5 className="font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {q.client_name}
                          </h5>
                          
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-4 0V5a2 2 0 014 0v1" />
                              </svg>
                              <span>{q.client_rut}</span>
                            </div>
                            {q.client_email && (
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>{q.client_email}</span>
                              </div>
                            )}
                            {q.total && (
                              <div className="flex items-center gap-2 mt-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                                <span className="font-medium text-green-600 text-base">
                                  ${q.total?.toLocaleString('es-ES') || '0'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center text-gray-400 group-hover:text-blue-500 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-3">
                    <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-base">
                    {quotesSearch ? 'No se encontraron cotizaciones' : 'No hay cotizaciones generadas'}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {quotesSearch ? 'Intenta cambiar el término de búsqueda' : 'Las cotizaciones aparecerán aquí una vez que las generes'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cotizaciones