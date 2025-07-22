import { useState, useEffect } from 'react'
import SummaryCard from '@components/SummaryCard.jsx'
import DataTable from '@components/DataTable.jsx'
import { fetchAll } from '../api.js'

function ReportesFinanciero() {
  const today = new Date().toISOString().slice(0, 10)
  const first = today.slice(0, 8) + '01'
  const [startDate, setStartDate] = useState(first)
  const [endDate, setEndDate] = useState(today)
  const [summary, setSummary] = useState(null)
  const [byCat, setByCat] = useState([])
  const [loading, setLoading] = useState(false)

  const loadData = async () => {
    setLoading(true)
    const [sales, products, categories] = await Promise.all([
      fetchAll('sales/'),
      fetchAll('products/'),
      fetchAll('categories/')
    ])
    const start = new Date(startDate)
    const end = new Date(endDate + 'T23:59:59')
    const filtered = sales.filter((s) => {
      const d = new Date(s.sale_date)
      return d >= start && d <= end
    })
    let ingresos = 0
    let costos = 0
    const catMap = {}
    filtered.forEach((s) => {
      let saleCost = 0
      s.details.forEach((d) => {
        const p = products.find((pr) => pr.id === d.product_id)
        if (!p) return
        const sub = parseFloat(d.subtotal) || 0
        const cost = parseFloat(p.cost || 0)
        ingresos += sub
        saleCost += cost * d.quantity
        const cat = p.category
        if (!catMap[cat]) catMap[cat] = { ingresos: 0, costos: 0 }
        catMap[cat].ingresos += sub
        catMap[cat].costos += cost * d.quantity
      })
      costos += saleCost
    })
    const utilidad = ingresos - costos
    const catArray = Object.entries(catMap).map(([id, val]) => ({
      categoria: categories.find((c) => c.id === parseInt(id))?.name || id,
      ingresos: val.ingresos,
      utilidad: val.ingresos - val.costos
    }))
    setSummary({ ingresos, costos, utilidad })
    setByCat(catArray)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const maxVal = Math.max(...byCat.map((c) => c.ingresos), 1)

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
        <button onClick={() => window.print()} className="h-10 px-4 bg-green-600 text-white rounded-md">
          Exportar PDF
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
            <h3 className="font-semibold mb-2">Ingresos por categoría</h3>
            <div className="flex items-end h-48 gap-3">
              {byCat.map((c) => (
                <div key={c.categoria} className="flex-1 flex flex-col items-center">
                  <div className="w-4 bg-blue-500" style={{ height: `${(c.ingresos / maxVal) * 100}%` }}></div>
                  <span className="text-xs mt-1">{c.categoria}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Detalle por categoría</h3>
            <div className="max-h-[60vh] overflow-y-auto">
              <DataTable
                headers={["Categoría", "Ingresos", "Utilidad"]}
                rows={byCat.map((c) => [
                  c.categoria,
                  c.ingresos.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
                  c.utilidad.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                ])}
              />
            </div>
          </div>
        </div>
      )}

      {loading && <p className="text-sm">Cargando...</p>}
    </div>
  )
}

export default ReportesFinanciero
