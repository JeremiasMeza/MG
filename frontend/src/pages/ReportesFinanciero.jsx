import { useState, useEffect, useCallback } from 'react'
import SummaryCard from '@components/SummaryCard.jsx'
import { fetchAll } from '../api.js'

function ReportesFinanciero() {
  const today = new Date().toISOString().slice(0, 10)
  const first = `${today.slice(0, 8)}01`

  const [startDate, setStartDate] = useState(first)
  const [endDate, setEndDate] = useState(today)
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadData = useCallback(async () => {
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
    let ingresos = 0
    let costos = 0
    filtered.forEach((s) => {
      let saleCost = 0
      s.details.forEach((d) => {
        const p = products.find((pr) => pr.id === d.product_id)
        if (!p) return
        const sub = parseFloat(d.subtotal) || 0
        const cost = parseFloat(p.cost || 0)
        ingresos += sub
        saleCost += cost * d.quantity
      })
      costos += saleCost
    })
    const utilidad = ingresos - costos
    setSummary({ ingresos, costos, utilidad })
    setLoading(false)
  }, [startDate, endDate])

  useEffect(() => {
    loadData()
  }, [loadData])


  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Reporte Financiero</h2>

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
        <button onClick={loadData} className="h-10 px-4 bg-blue-600 text-white rounded-md">
          Consultar
        </button>
      </div>

      {summary && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <SummaryCard
              title="Ingresos"
              value={summary.ingresos.toLocaleString('es-CL', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            />
            <SummaryCard
              title="Egresos"
              value={summary.costos.toLocaleString('es-CL', {
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
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Resumen Financiero</h3>
            <p className="text-sm text-gray-500">
              En este espacio se mostrarán gráficos financieros adaptados a tu negocio.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Detalle de ingresos</h3>
            <p className="text-sm text-gray-500">
              Aquí podrás revisar reportes personalizados según las necesidades de la mueblería.
            </p>
          </div>
        </div>
      )}

      {loading && <p className="text-sm">Cargando...</p>}
    </div>
  )
}

export default ReportesFinanciero
