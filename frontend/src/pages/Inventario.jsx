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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Venta #{selectedSale.id}</h3>
              <button
                type="button"
                onClick={() => setSelectedSale(null)}
                className="bg-white/10 hover:bg-white/20 text-white rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cerrar
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto text-sm flex-1">
              <p>
                <span className="font-medium">Cliente:</span>{' '}
                {selectedSale.client_first_name} {selectedSale.client_last_name}
              </p>
              <p>
                <span className="font-medium">RUT:</span> {selectedSale.client_rut}
              </p>
              <p>
                <span className="font-medium">Fecha:</span>{' '}
                {new Date(selectedSale.sale_date).toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Total:</span>{' '}
                {parseFloat(selectedSale.total).toLocaleString('es-CL', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Detalles</h4>
              <ul className="space-y-1 max-h-60 overflow-y-auto text-sm">
                {selectedSale.details.map((d, i) => (
                  <li key={i} className="flex justify-between items-start">
                    <div>
                      <p>{productMap[d.product_id]?.name || `Producto ${d.product_id}`}</p>
                      {productMap[d.product_id]?.barcode && (
                        <p className="text-xs text-gray-500">
                          Cod: {productMap[d.product_id].barcode}
                        </p>
                      )}
                    </div>
                    <span className="text-gray-700">x{d.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
            {receiptUrl && (
              <div className="pt-4 flex justify-end">
                <a
                  href={receiptUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Descargar Boleta
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Inventario
