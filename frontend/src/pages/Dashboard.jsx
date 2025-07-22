import { useState, useEffect } from 'react'
import SummaryCard from '@components/SummaryCard.jsx'
import { fetchAll } from '../api.js'
import { Link } from 'react-router-dom'

function Dashboard() {
  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])
  const [stats, setStats] = useState(null)
  const [weekly, setWeekly] = useState({})

  const loadData = async () => {
    const [prods, salesData] = await Promise.all([
      fetchAll('products/'),
      fetchAll('sales/')
    ])
    setProducts(prods)
    setSales(salesData)
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const critical = products.filter((p) => p.stock < p.stock_minimum).length
    const active = products.filter((p) => p.is_active).length

    const limit = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const soldProducts = new Set()
    sales
      .filter((s) => new Date(s.sale_date) >= limit)
      .forEach((s) => s.details.forEach((d) => soldProducts.add(d.product_id)))
    const withoutMove = products.filter((p) => !soldProducts.has(p.id)).length

    const weekStart = new Date()
    const day = weekStart.getDay()
    const diff = (day === 0 ? 6 : day - 1)
    weekStart.setDate(weekStart.getDate() - diff)
    weekStart.setHours(0, 0, 0, 0)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    const salesWeek = sales.filter((s) => {
      const d = new Date(s.sale_date)
      return d >= weekStart && d <= weekEnd
    })

    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
    const daily = { Lun: 0, Mar: 0, Mié: 0, Jue: 0, Vie: 0, Sáb: 0, Dom: 0 }
    salesWeek.forEach((s) => {
      const d = new Date(s.sale_date)
      const idx = (d.getDay() + 6) % 7
      daily[days[idx]] += parseFloat(s.total)
    })

    setWeekly(daily)
    setStats({ critical, withoutMove, salesCount: salesWeek.length, active })
  }, [products, sales])

  const maxVal = Math.max(...Object.values(weekly), 1)
  const totalWeek = Object.values(weekly).reduce((a, b) => a + b, 0)

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard title="Stock crítico" value={stats.critical} />
          <SummaryCard title="Sin movimiento" value={stats.withoutMove} />
          <SummaryCard title="Ventas semana" value={stats.salesCount} />
          <SummaryCard title="Productos activos" value={stats.active} />
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Ventas por día de la semana</h3>
        <div className="flex items-end h-48 gap-3">
          {Object.entries(weekly).map(([d, val]) => (
            <div key={d} className="flex-1 flex flex-col items-center">
              <div className="w-4 bg-blue-500" style={{ height: `${(val / maxVal) * 100}%` }}></div>
              <span className="text-xs mt-1">{d}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-center mt-2 font-medium">
          Total semana: {totalWeek.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/inventario/productos"
          className="bg-blue-600 text-white rounded-lg p-4 flex items-center justify-center hover:bg-blue-700"
        >
          Agregar nuevo producto
        </Link>
        <Link
          to="/ventas"
          className="bg-blue-600 text-white rounded-lg p-4 flex items-center justify-center hover:bg-blue-700"
        >
          Registrar venta
        </Link>
        <Link
          to="/inventario"
          className="bg-blue-600 text-white rounded-lg p-4 flex items-center justify-center hover:bg-blue-700"
        >
          Ver inventario
        </Link>
        <Link
          to="/reportes"
          className="bg-blue-600 text-white rounded-lg p-4 flex items-center justify-center hover:bg-blue-700"
        >
          Ir a reportes
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
