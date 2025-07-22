import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Inventario() {
  const [sales, setSales] = useState([])
  const [products, setProducts] = useState([])
  const [selectedSale, setSelectedSale] = useState(null)
  const [receiptUrl, setReceiptUrl] = useState('')
  const [salesSearch, setSalesSearch] = useState('')
  const token = localStorage.getItem('access')
  const authHeaders = { Authorization: `Bearer ${token}` }

  const fetchAll = async (url) => {
    const items = []
    let next = url
    while (next) {
      const resp = await fetch(next, { headers: authHeaders })
      const data = await resp.json()
      if (Array.isArray(data)) {
        items.push(...data)
        break
      }
      items.push(...(data.results || []))
      next = data.next
    }
    return items
  }

  const fetchData = () => {
    Promise.all([
      fetchAll('http://192.168.1.52:8000/api/sales/'),
      fetchAll('http://192.168.1.52:8000/api/products/'),
    ])
      .then(([salesData, productsData]) => {
        setSales(salesData)
        setProducts(productsData)
      })
      .catch((e) => console.error(e))
  }

  useEffect(() => {
    fetchData()
  }, [])

  const productMap = Object.fromEntries(products.map((p) => [p.id, p]))
  const productSales = {}
  sales.forEach((s) => {
    s.details.forEach((d) => {
      productSales[d.product_id] = (productSales[d.product_id] || 0) + d.quantity
    })
  })
  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, qty]) => ({ id: parseInt(id), qty, name: productMap[id]?.name }))

  const lowStockProducts = products.filter(
    (p) => p.stock < p.stock_minimum
  )

  const filteredSales = sales.filter((s) => {
    const fullName = `${s.client_first_name} ${s.client_last_name}`.toLowerCase()
    const query = salesSearch.toLowerCase()
    return (
      s.id.toString().includes(query) ||
      fullName.includes(query) ||
      (s.client_rut || '').toLowerCase().includes(query)
    )
  })

  const openSale = async (sale) => {
    setSelectedSale(sale)
    setReceiptUrl('')
    try {
      const resp = await fetch(
        `http://192.168.1.52:8000/api/sales/${sale.id}/export/`,
        { headers: authHeaders }
      )
      if (resp.ok) {
        const data = await resp.json()
        setReceiptUrl(data.pdf_url)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Inventario</h2>
        <div className="space-x-2">
          <Link
            to="/inventario/productos"
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Productos
          </Link>
          <Link
            to="/inventario/categorias"
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Categorías
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Productos más vendidos</h3>
          {topProducts.length > 0 ? (
            <ul className="space-y-2">
              {topProducts.map((p) => (
                <li key={p.id} className="flex justify-between text-sm">
                  <span>{p.name || `Producto ${p.id}`}</span>
                  <span className="font-medium">{p.qty}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No hay datos</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-4 md:row-span-2">
          <h3 className="text-lg font-semibold mb-3">Ventas registradas</h3>
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Buscar por número, nombre o RUT..."
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm text-sm"
              value={salesSearch}
              onChange={(e) => setSalesSearch(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          {filteredSales.length > 0 ? (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {filteredSales.map((s) => (
                <div
                  key={s.id}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                  onClick={() => openSale(s)}
                >
                  <div>
                    <p className="font-medium text-gray-800">Venta #{s.id}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(s.sale_date).toLocaleString()}
                    </p>
                  </div>
                  <div className="font-bold text-gray-800">
                    {parseFloat(s.total).toLocaleString('es-CL', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No hay ventas registradas</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Productos con stock bajo</h3>
          {lowStockProducts.length > 0 ? (
            <ul className="space-y-2">
              {lowStockProducts.map((p) => (
                <li key={p.id} className="flex justify-between text-sm">
                  <span>{p.name}</span>
                  <span className="font-medium">
                    {p.stock}/{p.stock_minimum}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No hay productos con stock bajo</p>
          )}
        </div>
      </div>

      {selectedSale && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden transform animate-in slide-in-from-bottom-4 duration-300">
      {/* Header - Mantiene el diseño azul original */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-lg p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Venta #{selectedSale.id}</h3>
            <p className="text-blue-100 text-sm opacity-90">Detalles de la transacción</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setSelectedSale(null)}
          className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 flex items-center gap-2 hover:scale-105"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cerrar
        </button>
      </div>

      {/* Contenido principal */}
      <div className="p-6 flex-1 overflow-y-auto">
        {/* Información del cliente */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 mb-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 rounded-lg p-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-800 text-lg">Información del Cliente</h4>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-1">Nombre completo</span>
                <p className="text-gray-900 font-medium bg-white rounded-lg px-3 py-2 border border-gray-200">
                  {selectedSale.client_first_name} {selectedSale.client_last_name}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-1">RUT</span>
                <p className="text-gray-900 font-medium bg-white rounded-lg px-3 py-2 border border-gray-200">
                  {selectedSale.client_rut}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-1">Fecha de venta</span>
                <p className="text-gray-900 font-medium bg-white rounded-lg px-3 py-2 border border-gray-200">
                  {new Date(selectedSale.sale_date).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-1">Total</span>
                <p className="text-green-700 font-bold text-xl bg-green-50 rounded-lg px-3 py-2 border border-green-200">
                  ${parseFloat(selectedSale.total).toLocaleString('es-CL', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detalles de productos - DISEÑO MEJORADO */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg p-2 shadow-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-lg">Productos Vendidos</h4>
                  <p className="text-sm text-gray-500">Resumen de productos en esta venta</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
                  {selectedSale.details.length} {selectedSale.details.length === 1 ? 'producto' : 'productos'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-5">
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {selectedSale.details.map((d, i) => (
                <div 
                  key={i} 
                  className="group relative bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-blue-300 transition-all duration-300 hover:-translate-y-0.5"
                >
                  {/* Línea decorativa izquierda */}
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-gradient-to-b from-blue-400 to-green-400 rounded-r-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex items-center justify-between ml-3">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Icono del producto con gradiente */}
                      <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-3 flex-shrink-0 group-hover:from-blue-200 group-hover:to-blue-300 transition-colors">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      
                      {/* Información del producto */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-semibold text-gray-900 truncate text-base group-hover:text-blue-700 transition-colors">
                            {productMap[d.product_id]?.name || `Producto ${d.product_id}`}
                          </h5>
                          {/* Badge del número de item */}
                          <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">
                            #{i + 1}
                          </span>
                        </div>
                        {productMap[d.product_id]?.barcode && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                            </svg>
                            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">
                              {productMap[d.product_id].barcode}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Cantidad con diseño mejorado */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-4">
                      <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl px-4 py-2 min-w-0 group-hover:from-emerald-100 group-hover:to-green-100 transition-colors">
                        <div className="text-center">
                          <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Cantidad</div>
                          <div className="text-2xl font-bold text-emerald-700 leading-none">
                            {d.quantity}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Resumen al final de la lista */}
            {selectedSale.details.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-medium">Total de items:</span>
                  <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                    {selectedSale.details.reduce((sum, d) => sum + d.quantity, 0)} unidades
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer con botón de descarga */}
      {receiptUrl && (
        <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 rounded-lg p-1.5">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Boleta disponible para descarga
              </p>
            </div>
            <a
              href={receiptUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl px-6 py-3 font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Descargar Boleta
            </a>
          </div>
        </div>
      )}
    </div>
  </div>
)}
    </div>
  )
}

export default Inventario
