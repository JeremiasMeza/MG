import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchAll, API_BASE } from '../api.js'
import useSaleDetails from '../hooks/useSaleDetails.js'
import SaleDetailsModal from '../components/SaleDetailsModal.jsx'

function Inventario() {
  const [sales, setSales] = useState([])
  const [products, setProducts] = useState([])
  const {
    selectedSale,
    receiptUrl,
    openSale,
    closeSale,
  } = useSaleDetails()
  const [salesSearch, setSalesSearch] = useState('')

  const fetchData = () => {
    Promise.all([
      fetchAll('sales/'),
      fetchAll('products/'),
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

      <SaleDetailsModal
        sale={selectedSale}
        onClose={closeSale}
        productMap={productMap}
        receiptUrl={receiptUrl}
      />
    </div>
  )
}

export default Inventario
