import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Inventario() {
  const [sales, setSales] = useState([])
  const [products, setProducts] = useState([])
  const [selectedSale, setSelectedSale] = useState(null)
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
          {sales.length > 0 ? (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {sales.map((s) => (
                <div
                  key={s.id}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                  onClick={() => setSelectedSale(s)}
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
      </div>

      {selectedSale && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Venta #{selectedSale.id}
              </h3>
              <button
                onClick={() => setSelectedSale(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                &#10005;
              </button>
            </div>
            <div className="space-y-2 text-sm">
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
            <div className="mt-4">
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
          </div>
        </div>
      )}
    </div>
  )
}

export default Inventario
