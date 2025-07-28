import { useState, useEffect } from 'react'
import SummaryCard from '@components/SummaryCard.jsx'
import DataTable from '@components/DataTable.jsx'
import { fetchAll } from '../api.js'

function Reportes() {
  const today = new Date().toISOString().slice(0, 10)
  const first = today.slice(0, 8) + '01'
  const [startDate, setStartDate] = useState(first)
  const [endDate, setEndDate] = useState(today)
  const [summary, setSummary] = useState(null)
  const [monthly, setMonthly] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [lowDays, setLowDays] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const [sales, products] = await Promise.all([
      fetchAll('sales/'),
      fetchAll('products/')
    ])
    const start = new Date(startDate)
    const end = new Date(endDate + 'T23:59:59')
    const filtered = sales.filter((s) => {
      const d = new Date(s.sale_date)
      return d >= start && d <= end
    })
    let total = 0
    const daily = {}
    const monthlyMap = {}
    const countMap = {}
    filtered.forEach((s) => {
      total += parseFloat(s.total)
      const day = s.sale_date.slice(0, 10)
      daily[day] = (daily[day] || 0) + parseFloat(s.total)
      const month = s.sale_date.slice(0, 7)
      if (!monthlyMap[month]) monthlyMap[month] = { ventas: 0, costos: 0 }
      let saleCost = 0
      s.details.forEach((d) => {
        countMap[d.product_id] = (countMap[d.product_id] || 0) + d.quantity
        const p = products.find((pr) => pr.id === d.product_id)
        if (p && p.cost) saleCost += parseFloat(p.cost) * d.quantity
      })
      monthlyMap[month].ventas += parseFloat(s.total)
      monthlyMap[month].costos += saleCost
    })
    const monthlyArr = Object.entries(monthlyMap)
      .sort()
      .map(([m, val]) => ({ month: m, ventas: val.ventas, utilidad: val.ventas - val.costos }))
    const costosTotales = monthlyArr.reduce((sum, m) => sum + (m.ventas - m.utilidad), 0)
    const avgDaily = Object.values(daily).reduce((a, b) => a + b, 0) / (Object.keys(daily).length || 1)
    const low = Object.entries(daily)
      .filter(([, t]) => t < avgDaily * 0.5)
      .map(([d]) => d)
    const tops = Object.entries(countMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, qty]) => ({
        id: parseInt(id),
        qty,
        name: products.find((p) => p.id === parseInt(id))?.name || `Producto ${id}`
      }))
    const lowStock = products.filter((p) => p.stock < p.stock_minimum)
    setSummary({ totalVentas: total, utilidad: total - costosTotales, lowStock })
    setMonthly(monthlyArr)
    setTopProducts(tops)
    setLowDays(low)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const maxVal = Math.max(...monthly.map((m) => Math.max(m.ventas, m.utilidad)), 1)

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800">Reportes</h2>

      <div className="flex items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md"
          />
        </div>
        <button
          onClick={fetchData}
          className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Consultar
        </button>
      </div>

      {summary && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard
              title="Total Ventas"
              value={summary.totalVentas.toLocaleString('es-CL', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            />
            <SummaryCard
              title="Utilidad Neta"
              value={summary.utilidad.toLocaleString('es-CL', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            />
            <SummaryCard title="Productos con stock crítico" value={summary.lowStock.length} />
            <SummaryCard title="Días con ventas bajas" value={lowDays.length} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h3 className="font-semibold text-gray-800">Comparativa mensual</h3>
            <div className="flex items-end h-48 gap-3">
              {monthly.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center">
                  <div className="w-4 bg-blue-500" style={{ height: `${(m.ventas / maxVal) * 100}%` }}></div>
                  <div className="w-4 bg-green-500 mt-1" style={{ height: `${(m.utilidad / maxVal) * 100}%` }}></div>
                  <span className="text-xs mt-1">{m.month.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Top 5 productos</h3>
              <div className="max-h-[60vh] overflow-y-auto">
                <DataTable
                  headers={["Producto", "Cantidad"]}
                  rows={topProducts.map((p) => [p.name, p.qty])}
                />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Productos con stock crítico</h3>
              {summary.lowStock.length > 0 ? (
                <ul className="space-y-1 text-sm max-h-60 overflow-y-auto">
                  {summary.lowStock.map((p) => (
                    <li key={p.id} className="flex justify-between">
                      <span>{p.name}</span>
                      <span className="text-orange-600 font-medium">
                        {p.stock}/{p.stock_minimum}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Sin alertas</p>
              )}
            </div>
          </div>
        </div>
      )}

      {loading && <p className="text-sm">Cargando...</p>}
    </div>
  )
}

export default Reportes
