import { useState, useEffect } from 'react'
import DataTable from '@components/DataTable.jsx'
import { fetchAll } from '../api.js'

function ReportesInventario() {
  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])
  const [categories, setCategories] = useState([])
  const [catFilter, setCatFilter] = useState('')
  const [brandFilter, setBrandFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [lowMovement, setLowMovement] = useState([])

  const loadData = async () => {
    setLoading(true)
    const [prods, salesData, cats] = await Promise.all([
      fetchAll('products/'),
      fetchAll('sales/'),
      fetchAll('categories/')
    ])
    setProducts(prods)
    setSales(salesData)
    setCategories(cats)
    const limit = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    const movement = {}
    salesData
      .filter((s) => new Date(s.sale_date) >= limit)
      .forEach((s) => {
        s.details.forEach((d) => {
          movement[d.product_id] = (movement[d.product_id] || 0) + d.quantity
        })
      })
    const low = prods
      .map((p) => ({ ...p, qty: movement[p.id] || 0 }))
      .sort((a, b) => a.qty - b.qty)
      .slice(0, 5)
    setLowMovement(low)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const saleMap = {}
  sales.forEach((s) => {
    s.details.forEach((d) => {
      const date = new Date(s.sale_date)
      if (!saleMap[d.product_id] || date > saleMap[d.product_id]) {
        saleMap[d.product_id] = date
      }
    })
  })

  const filtered = products.filter(
    (p) =>
      (catFilter === '' || p.category === parseInt(catFilter)) &&
      (brandFilter === '' || (p.brand || '').toLowerCase().includes(brandFilter.toLowerCase()))
  )

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Reporte de Inventario</h2>

      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="text-sm text-gray-700">Categoría</label>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md"
          >
            <option value="">Todas</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-700">Proveedor</label>
          <input
            type="text"
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md"
          />
        </div>
        <button
          onClick={() => window.print()}
          className="h-10 px-4 bg-blue-600 text-white rounded-md"
        >
          Exportar PDF
        </button>
        <button
          onClick={() => window.print()}
          className="h-10 px-4 bg-green-600 text-white rounded-md"
        >
          Exportar Excel
        </button>
      </div>

      <div className="max-h-[60vh] overflow-y-auto">
        <DataTable
          headers={[
            'Nombre',
            'Categoría',
            'Stock',
            'Stock mínimo',
            'Última venta'
          ]}
          rows={filtered.map((p) => [
            p.name,
            categories.find((c) => c.id === p.category)?.name || '-',
            p.stock,
            p.stock_minimum,
            saleMap[p.id] ? saleMap[p.id].toLocaleDateString() : '-'
          ])}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-2">Productos con menor movimiento</h3>
        {lowMovement.length > 0 ? (
          <ul className="space-y-1 text-sm max-h-60 overflow-y-auto">
            {lowMovement.map((p) => (
              <li key={p.id} className="flex justify-between">
                <span>{p.name}</span>
                <span>{p.qty}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">Sin datos</p>
        )}
      </div>

      {loading && <p className="text-sm">Cargando...</p>}
    </div>
  )
}

export default ReportesInventario
