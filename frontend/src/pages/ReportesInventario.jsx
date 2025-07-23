import { useState, useEffect } from 'react'
import DataTable from '@components/DataTable.jsx'
import { fetchAll } from '../api.js'

function ReportesInventario() {
  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])
  const [categories, setCategories] = useState([])
  const [catFilter, setCatFilter] = useState('')
  const [loading, setLoading] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const [prods, salesData, cats] = await Promise.all([
        fetchAll('products/'),
        fetchAll('sales/'),
        fetchAll('categories/')
      ])
      setProducts(prods)
      setSales(salesData)
      setCategories(cats)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Calcular última venta por producto
  const saleMap = {}
  sales.forEach((s) => {
    s.details.forEach((d) => {
      const date = new Date(s.sale_date)
      if (!saleMap[d.product_id] || date > saleMap[d.product_id]) {
        saleMap[d.product_id] = date
      }
    })
  })

  // Filtrar productos
  const filtered = products.filter(
    (p) =>
      (catFilter === '' || p.category === parseInt(catFilter))
  )

  // Productos con stock bajo (stock < stock_minimum)
  const lowStockProducts = filtered.filter(p => p.stock < p.stock_minimum && p.stock > 0)

  // Productos sin stock
  const outOfStockProducts = filtered.filter(p => p.stock === 0)

  // Estadísticas generales
  const totalProducts = filtered.length
  const lowStockCount = lowStockProducts.length
  const outOfStockCount = outOfStockProducts.length
  const healthyStockCount = totalProducts - lowStockCount - outOfStockCount

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <div className="h-full p-4 space-y-4 flex flex-col">
        {/* Header - Reducido */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reporte de Inventario</h1>
              <p className="text-sm text-gray-600">Gestiona y monitorea el estado de tu inventario</p>
            </div>
            
            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-blue-50 p-2 rounded text-center border border-blue-100 min-w-0">
                <div className="text-lg font-bold text-blue-600">{totalProducts}</div>
                <div className="text-xs text-blue-600">Total</div>
              </div>
              <div className="bg-green-50 p-2 rounded text-center border border-green-100 min-w-0">
                <div className="text-lg font-bold text-green-600">{healthyStockCount}</div>
                <div className="text-xs text-green-600">Saludable</div>
              </div>
              <div className="bg-yellow-50 p-2 rounded text-center border border-yellow-100 min-w-0">
                <div className="text-lg font-bold text-yellow-600">{lowStockCount}</div>
                <div className="text-xs text-yellow-600">Bajo</div>
              </div>
              <div className="bg-red-50 p-2 rounded text-center border border-red-100 min-w-0">
                <div className="text-lg font-bold text-red-600">{outOfStockCount}</div>
                <div className="text-xs text-red-600">Sin Stock</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y acciones - Compacto */}
        <div className="bg-white rounded-lg shadow-md p-3 border border-gray-200 flex-shrink-0">
          <div className="flex items-end gap-3">
            <div className="w-1/4">
              <label className="block text-xs font-medium text-gray-700 mb-1">Categoría</label>
              <select
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
                className="w-full border border-gray-300 px-2 py-1.5 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Todas las categorías</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1"></div>
          </div>
        </div>

        {/* Alertas de inventario - Más grandes */}
        <div className="grid grid-cols-2 gap-4 h-80 flex-shrink-0">
          {/* Productos con stock bajo */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden h-full">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white bg-opacity-20 rounded">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Stock Bajo</h3>
                  <p className="text-yellow-100 text-sm">Requiere atención ({lowStockCount} productos)</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 h-64 overflow-y-auto">
              {lowStockProducts.length > 0 ? (
                <div className="space-y-2">
                  {lowStockProducts.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">{p.name}</h4>
                        <p className="text-sm text-gray-600 truncate">
                          {categories.find((c) => c.id === p.category)?.name || 'Sin categoría'}
                        </p>
                        <p className="text-xs text-gray-500">{p.brand || 'Sin marca'}</p>
                      </div>
                      <div className="text-right ml-3 flex-shrink-0">
                        <div className="text-lg font-bold text-yellow-600">{p.stock}</div>
                        <div className="text-xs text-gray-500">mín: {p.stock_minimum}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">No hay productos con stock bajo</p>
                  <p className="text-xs text-gray-400">Todos los productos están por encima del mínimo</p>
                </div>
              )}
            </div>
          </div>

          {/* Productos sin stock */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden h-full">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white bg-opacity-20 rounded">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Sin Stock</h3>
                  <p className="text-red-100 text-sm">Reposición urgente ({outOfStockCount} productos)</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 h-64 overflow-y-auto">
              {outOfStockProducts.length > 0 ? (
                <div className="space-y-2">
                  {outOfStockProducts.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">{p.name}</h4>
                        <p className="text-sm text-gray-600 truncate">
                          {categories.find((c) => c.id === p.category)?.name || 'Sin categoría'}
                        </p>
                        <p className="text-xs text-gray-500">{p.brand || 'Sin marca'}</p>
                      </div>
                      <div className="text-right ml-3 flex-shrink-0">
                        <div className="text-lg font-bold text-red-600">0</div>
                        <div className="text-xs text-gray-500">
                          {saleMap[p.id] ? 
                            `Últ: ${saleMap[p.id].toLocaleDateString('es-CL', {day: '2-digit', month: '2-digit'})}` : 
                            'Sin ventas'
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Todos los productos tienen stock</p>
                  <p className="text-xs text-gray-400">No hay productos que requieran reposición</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabla principal - Más pequeña con scroll */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex-1 min-h-0">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex-shrink-0">
            <h3 className="text-lg font-semibold text-gray-900">Inventario Completo</h3>
            <p className="text-sm text-gray-600">Lista detallada de todos los productos ({filtered.length} productos)</p>
          </div>
          
          <div className="flex-1 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600 font-medium">Cargando datos...</span>
              </div>
            ) : (
              <div className="h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <DataTable
                  headers={[
                    'Producto',
                    'Categoría',
                    'Stock Actual',
                    'Stock Mínimo',
                    'Última Venta',
                    'Estado'
                  ]}
                  rows={filtered.map((p) => [
                    p.name,
                    categories.find((c) => c.id === p.category)?.name || '-',
                    p.stock,
                    p.stock_minimum,
                    saleMap[p.id] ? saleMap[p.id].toLocaleDateString('es-CL', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit'
                    }) : '-',
                    p.stock === 0 ? 
                      <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">Sin Stock</span> :
                      p.stock < p.stock_minimum ?
                      <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">Stock Bajo</span> :
                      <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Stock OK</span>
                  ])}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportesInventario