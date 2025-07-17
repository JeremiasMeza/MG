import { useState, useEffect } from 'react'

function Dashboard() {
  const today = new Date().toISOString().slice(0, 10)
  const past = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)

  const [startDate, setStartDate] = useState(past)
  const [endDate, setEndDate] = useState(today)
  const [summary, setSummary] = useState(null)
  const token = localStorage.getItem('access')

  const fetchSummary = async () => {
    const params = new URLSearchParams()
    if (startDate) params.append('start_date', startDate)
    if (endDate) params.append('end_date', endDate)
    try {
      const resp = await fetch(
        `http://192.168.1.52:8000/api/reports/summary/?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (!resp.ok) throw new Error('Error al cargar')
      const data = await resp.json()
      setSummary(data)
    } catch {
      setSummary(null)
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [])

  const maxDaily =
    summary?.daily_sales.reduce((m, d) => Math.max(m, d.total), 0) || 0

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold">Dashboard</h2>
      <div className="flex items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Desde
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-2 py-1 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hasta
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-2 py-1 rounded-md"
          />
        </div>
        <button
          onClick={fetchSummary}
          className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Consultar
        </button>
      </div>

      {summary && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-sm text-gray-500">Total Ventas</p>
              <p className="text-xl font-semibold text-gray-800">
                {summary.total_ventas.toLocaleString('es-CL', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-sm text-gray-500">IVA</p>
              <p className="text-xl font-semibold text-gray-800">
                {summary.total_iva.toLocaleString('es-CL', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-sm text-gray-500">Costos</p>
              <p className="text-xl font-semibold text-gray-800">
                {summary.total_costos.toLocaleString('es-CL', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-sm text-gray-500">Ganancia</p>
              <p className="text-xl font-semibold text-gray-800">
                {summary.ganancia_neta.toLocaleString('es-CL', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
          </div>

          {summary.daily_sales.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Ventas diarias</h3>
              <div className="flex items-end gap-1 h-40">
                {summary.daily_sales.map((d) => (
                  <div
                    key={d.day}
                    title={`${d.day}: $${d.total.toLocaleString('es-CL', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}`}
                    className="bg-blue-500 w-3"
                    style={{ height: maxDaily ? `${(d.total / maxDaily) * 100}%` : 0 }}
                  ></div>
                ))}
              </div>
            </div>
          )}

          {summary.best_selling_product && (
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-sm text-gray-500">Producto más vendido</p>
              <p className="font-medium text-gray-800">
                {summary.best_selling_product.name} (
                {summary.best_selling_product.quantity})
              </p>
            </div>
          )}

          {summary.low_stock_products.length > 0 && (
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-sm font-medium text-gray-800 mb-2">
                Productos con stock bajo
              </p>
              <ul className="space-y-1">
                {summary.low_stock_products.map((p) => (
                  <li key={p.id} className="text-sm text-orange-600">
                    {p.name} ({p.stock}/{p.stock_minimum})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard
