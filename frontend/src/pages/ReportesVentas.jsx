import { useState, useEffect } from 'react'
import DataTable from '@components/DataTable.jsx'
import { fetchAll, API_BASE, authHeaders } from '../api.js'

function ReportesVentas() {
  const today = new Date().toISOString().slice(0, 10)
  const first = today.slice(0, 8) + '01'
  const [startDate, setStartDate] = useState(first)
  const [endDate, setEndDate] = useState(today)
  const [sales, setSales] = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [userFilter, setUserFilter] = useState('')
  const [prodFilter, setProdFilter] = useState('')
  const [topProducts, setTopProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedSale, setSelectedSale] = useState(null)
  const [receiptUrl, setReceiptUrl] = useState('')

  const loadData = async () => {
    setLoading(true)
    const [salesData, productsData, usersData] = await Promise.all([
      fetchAll('sales/'),
      fetchAll('products/'),
      fetchAll('users/')
    ])
    setSales(salesData)
    setProducts(productsData)
    setUsers(usersData)
    setLoading(false)
    const counts = {}
    salesData.forEach((s) => {
      s.details.forEach((d) => {
        counts[d.product_id] = (counts[d.product_id] || 0) + d.quantity
      })
    })
    const tops = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id, qty]) => ({
        name: productsData.find((p) => p.id === parseInt(id))?.name || id,
        qty
      }))
    setTopProducts(tops)
  }

  useEffect(() => {
    loadData()
  }, [])

  const start = new Date(startDate)
  const end = new Date(endDate + 'T23:59:59')
  const filtered = sales.filter((s) => {
    const d = new Date(s.sale_date)
    return (
      d >= start &&
      d <= end &&
      (userFilter === '' || s.agent === parseInt(userFilter)) &&
      (prodFilter === '' || s.details.some((dt) => dt.product_id === parseInt(prodFilter)))
    )
  })

  const daily = {}
  filtered.forEach((s) => {
    const day = s.sale_date.slice(0, 10)
    daily[day] = (daily[day] || 0) + parseFloat(s.total)
  })
  const maxVal = Math.max(...Object.values(daily), 1)

  const productMap = Object.fromEntries(products.map((p) => [p.id, p]))

  const openSale = async (sale) => {
    setSelectedSale(sale)
    setReceiptUrl('')
    try {
      const resp = await fetch(
        `${API_BASE}/sales/${sale.id}/export/`,
        { headers: authHeaders() }
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
    <div className="h-screen p-6 space-y-6 bg-gray-50 overflow-hidden">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Reporte de Ventas</h2>

      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="text-sm text-gray-700">Desde</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="text-sm text-gray-700">Hasta</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="text-sm text-gray-700">Vendedor</label>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md"
          >
            <option value="">Todos</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-700">Producto</label>
          <select
            value={prodFilter}
            onChange={(e) => setProdFilter(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md"
          >
            <option value="">Todos</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <button onClick={() => window.print()} className="h-10 px-4 bg-blue-600 text-white rounded-md">
          Exportar PDF
        </button>
        <button onClick={() => window.print()} className="h-10 px-4 bg-green-600 text-white rounded-md">
          Exportar Excel
        </button>
      </div>

      <div className="max-h-[60vh] overflow-y-auto">
        <DataTable
          headers={["Fecha", "ID", "Cliente", "Total", "Vendedor"]}
          rows={filtered.map((s) => [
            new Date(s.sale_date).toLocaleDateString(),
            s.id,
            `${s.client_first_name} ${s.client_last_name}`,
            parseFloat(s.total).toLocaleString('es-CL', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }),
            users.find((u) => u.id === s.agent)?.username || s.agent
          ])}
          onRowClick={(row, i) => openSale(filtered[i])}
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Ventas por día</h3>
        <div className="flex items-end h-48 gap-3">
          {Object.entries(daily).map(([day, val]) => (
            <div key={day} className="flex-1 flex flex-col items-center">
              <div className="w-4 bg-blue-500" style={{ height: `${(val / maxVal) * 100}%` }}></div>
              <span className="text-xs mt-1">{day.split('-')[2]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Top 10 productos</h3>
        <div className="max-h-[60vh] overflow-y-auto">
          <DataTable
            headers={["Producto", "Cantidad"]}
            rows={topProducts.map((t) => [t.name, t.qty])}
          />
        </div>
      </div>

      {loading && <p className="text-sm">Cargando...</p>}

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
                  maximumFractionDigits: 0
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
                        <p className="text-xs text-gray-500">Cod: {productMap[d.product_id].barcode}</p>
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

export default ReportesVentas
