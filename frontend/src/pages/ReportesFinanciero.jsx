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
  const [byProduct, setByProduct] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('category')

  const loadData = async () => {
    setLoading(true)
    try {
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
      const prodMap = {}
      
      filtered.forEach((s) => {
        let saleCost = 0
        s.details.forEach((d) => {
          const p = products.find((pr) => pr.id === d.product_id)
          if (!p) return
          
          const subtotal = d.subtotal
          const cost = (p.cost || 0) * d.quantity
          
          ingresos += subtotal
          saleCost += cost
          
          // Category mapping
          const cat = p.category
          if (!catMap[cat]) catMap[cat] = { ingresos: 0, costos: 0, cantidad: 0 }
          catMap[cat].ingresos += subtotal
          catMap[cat].costos += cost
          catMap[cat].cantidad += d.quantity
          
          // Product mapping
          if (!prodMap[p.id]) prodMap[p.id] = { 
            name: p.name, 
            ingresos: 0, 
            costos: 0, 
            cantidad: 0,
            precio: p.price || 0
          }
          prodMap[p.id].ingresos += subtotal
          prodMap[p.id].costos += cost
          prodMap[p.id].cantidad += d.quantity
        })
        costos += saleCost
      })
      
      const utilidad = ingresos - costos
      const margen = ingresos > 0 ? ((utilidad / ingresos) * 100) : 0
      
      // Category analysis
      const catArray = Object.entries(catMap)
        .map(([id, val]) => ({
          categoria: categories.find((c) => c.id === parseInt(id))?.name || `Categoría ${id}`,
          ingresos: val.ingresos,
          costos: val.costos,
          utilidad: val.ingresos - val.costos,
          margen: val.ingresos > 0 ? ((val.ingresos - val.costos) / val.ingresos * 100) : 0,
          cantidad: val.cantidad
        }))
        .sort((a, b) => b.ingresos - a.ingresos)
      
      // Product analysis
      const prodArray = Object.values(prodMap)
        .map(p => ({
          ...p,
          utilidad: p.ingresos - p.costos,
          margen: p.ingresos > 0 ? ((p.ingresos - p.costos) / p.ingresos * 100) : 0
        }))
        .sort((a, b) => b.utilidad - a.utilidad)
        .slice(0, 15) // Top 15 products
      
      setSummary({ ingresos, costos, utilidad, margen, totalVentas: filtered.length })
      setByCat(catArray)
      setByProduct(prodArray)
    } catch (error) {
      console.error('Error loading financial data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [startDate, endDate])

  const formatCurrency = (value) => {
    return value.toLocaleString('es-CL', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
  }

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`
  }

  const maxCatVal = Math.max(...byCat.map((c) => c.ingresos), 1)

  return (
    <div className="h-screen p-6 space-y-6 bg-gray-50 overflow-hidden">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Reporte Financiero</h2>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4 bg-white p-4 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button 
          onClick={loadData} 
          disabled={loading}
          className="h-10 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors"
        >
          {loading ? 'Consultando...' : 'Consultar'}
        </button>
        <button 
          onClick={() => window.print()} 
          className="h-10 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
        >
          Exportar PDF
        </button>
      </div>

      {summary && (
        <div className="space-y-6 flex-1 overflow-hidden">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <SummaryCard
              title="Ingresos"
              value={`$${formatCurrency(summary.ingresos)}`}
              className="bg-gradient-to-br from-green-500 to-green-600 text-white"
            />
            <SummaryCard
              title="Egresos"
              value={`$${formatCurrency(summary.costos)}`}
              className="bg-gradient-to-br from-red-500 to-red-600 text-white"
            />
            <SummaryCard
              title="Utilidad Neta"
              value={`$${formatCurrency(summary.utilidad)}`}
              className={`${summary.utilidad >= 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-orange-500 to-orange-600'} text-white`}
            />
            <SummaryCard
              title="Margen"
              value={formatPercentage(summary.margen)}
              className="bg-gradient-to-br from-purple-500 to-purple-600 text-white"
            />
            <SummaryCard
              title="Ventas"
              value={summary.totalVentas.toString()}
              className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white"
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-24rem)] overflow-hidden">
            
            {/* Chart Column */}
            <div className="bg-white p-4 rounded-lg shadow flex flex-col">
              <h3 className="font-semibold mb-4 text-lg">Ingresos por Categoría</h3>
              <div className="flex-1 flex items-end justify-center">
                {byCat.length > 0 ? (
                  <div className="flex items-end h-full w-full gap-2 px-4">
                    {byCat.map((c, index) => (
                      <div key={c.categoria} className="flex-1 flex flex-col items-center h-full justify-end">
                        <div className="text-xs mb-2 font-medium">
                          ${formatCurrency(c.ingresos)}
                        </div>
                        <div 
                          className={`w-full bg-gradient-to-t ${
                            index % 4 === 0 ? 'from-blue-400 to-blue-600' :
                            index % 4 === 1 ? 'from-green-400 to-green-600' :
                            index % 4 === 2 ? 'from-purple-400 to-purple-600' :
                            'from-orange-400 to-orange-600'
                          } rounded-t transition-all duration-300 hover:opacity-80`}
                          style={{ height: `${Math.max((c.ingresos / maxCatVal) * 100, 5)}%` }}
                        ></div>
                        <span className="text-xs mt-2 text-center leading-tight max-w-full">
                          {c.categoria.length > 8 ? c.categoria.substring(0, 8) + '...' : c.categoria}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No hay datos para mostrar
                  </div>
                )}
              </div>
            </div>

            {/* Data Analysis Column */}
            <div className="bg-white p-4 rounded-lg shadow flex flex-col">
              {/* Tabs */}
              <div className="flex border-b mb-4">
                <button
                  onClick={() => setActiveTab('category')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === 'category' 
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Por Categoría
                </button>
                <button
                  onClick={() => setActiveTab('product')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === 'product' 
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Top Productos
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {activeTab === 'category' ? (
                  <DataTable
                    headers={["Categoría", "Ingresos", "Utilidad", "Margen", "Cantidad"]}
                    rows={byCat.map((c) => [
                      c.categoria,
                      `$${formatCurrency(c.ingresos)}`,
                      `$${formatCurrency(c.utilidad)}`,
                      formatPercentage(c.margen),
                      c.cantidad.toString()
                    ])}
                  />
                ) : (
                  <DataTable
                    headers={["Producto", "Ingresos", "Utilidad", "Margen", "Cantidad"]}
                    rows={byProduct.map((p) => [
                      p.name,
                      `$${formatCurrency(p.ingresos)}`,
                      `$${formatCurrency(p.utilidad)}`,
                      formatPercentage(p.margen),
                      p.cantidad.toString()
                    ])}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <p className="text-sm">Cargando datos financieros...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportesFinanciero