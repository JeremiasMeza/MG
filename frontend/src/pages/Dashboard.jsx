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

  // Función para crear el path SVG de la curva suave
  const createSmoothPath = (points) => {
    if (points.length < 2) return ''
    
    let path = `M ${points[0].x} ${points[0].y}`
    
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1]
      const currentPoint = points[i]
      const nextPoint = points[i + 1]
      
      const controlPoint1X = prevPoint.x + (currentPoint.x - prevPoint.x) * 0.3
      const controlPoint1Y = prevPoint.y
      const controlPoint2X = currentPoint.x - (nextPoint ? (nextPoint.x - currentPoint.x) * 0.3 : 0)
      const controlPoint2Y = currentPoint.y
      
      path += ` C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${currentPoint.x} ${currentPoint.y}`
    }
    
    return path
  }

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString + 'T00:00:00')
      if (isNaN(date.getTime())) return ''
      const day = date.getDate()
      return day.toString()
    } catch (error) {
      console.log('Error formateando fecha:', dateString)
      return ''
    }
  }

  const maxDaily = summary?.daily_sales.reduce((m, d) => Math.max(m, d.total), 0) || 0
  const minDaily = summary?.daily_sales.reduce((m, d) => Math.min(m, d.total), maxDaily) || 0

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
      
      <div className="flex items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Desde
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={fetchSummary}
          className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
        >
          Consultar
        </button>
      </div>

      {summary && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">Total Ventas</p>
              <p className="text-2xl font-semibold text-gray-800">
                {summary.total_ventas.toLocaleString('es-CL', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">IVA</p>
              <p className="text-2xl font-semibold text-gray-800">
                {summary.total_iva.toLocaleString('es-CL', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">Costos</p>
              <p className="text-2xl font-semibold text-gray-800">
                {summary.total_costos.toLocaleString('es-CL', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">Ganancia</p>
              <p className="text-2xl font-semibold text-gray-800">
                {summary.ganancia_neta.toLocaleString('es-CL', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de ventas diarias mejorado */}
            <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Ventas diarias</h3>
                <div className="text-sm text-gray-500">
                  {summary.daily_sales.length > 0 && (
                    <span>Promedio: {Math.round(summary.daily_sales.reduce((sum, d) => sum + d.total, 0) / summary.daily_sales.length).toLocaleString('es-CL')}</span>
                  )}
                </div>
              </div>
              
              {summary.daily_sales.length > 0 ? (
                <div className="relative">
                  {(() => {
                    // Configuración del gráfico
                    const chartWidth = 480
                    const chartHeight = 280
                    const paddingLeft = 60
                    const paddingRight = 20
                    const paddingTop = 20
                    const paddingBottom = 60
                    
                    const plotWidth = chartWidth - paddingLeft - paddingRight
                    const plotHeight = chartHeight - paddingTop - paddingBottom
                    
                    // Crear puntos para el gráfico
                    const points = summary.daily_sales.map((d, i) => ({
                      x: paddingLeft + (i / Math.max(summary.daily_sales.length - 1, 1)) * plotWidth,
                      y: paddingTop + (1 - (d.total - minDaily) / Math.max(maxDaily - minDaily, 1)) * plotHeight,
                      value: d.total,
                      date: d.date
                    }))

                    const smoothPath = createSmoothPath(points)
                    const areaPath = smoothPath + ` L ${paddingLeft + plotWidth} ${paddingTop + plotHeight} L ${paddingLeft} ${paddingTop + plotHeight} Z`

                    // Calcular ticks del eje Y
                    const yTicks = 5
                    const yStep = (maxDaily - minDaily) / (yTicks - 1)
                    const yTickValues = Array.from({length: yTicks}, (_, i) => minDaily + i * yStep)

                    return (
                      <div className="w-full">
                        <svg 
                          width={chartWidth} 
                          height={chartHeight} 
                          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                          className="w-full h-auto max-h-80"
                          style={{ minHeight: '280px' }}
                        >
                          {/* Grid horizontal */}
                          {yTickValues.map((value, i) => {
                            const y = paddingTop + (1 - (value - minDaily) / Math.max(maxDaily - minDaily, 1)) * plotHeight
                            return (
                              <g key={i}>
                                <line
                                  x1={paddingLeft}
                                  y1={y}
                                  x2={paddingLeft + plotWidth}
                                  y2={y}
                                  stroke="#f3f4f6"
                                  strokeWidth="1"
                                />
                                <text
                                  x={paddingLeft - 10}
                                  y={y + 4}
                                  textAnchor="end"
                                  className="text-xs fill-gray-500"
                                >
                                  {value.toLocaleString('es-CL', { 
                                    minimumFractionDigits: 0, 
                                    maximumFractionDigits: 0,
                                    notation: 'compact'
                                  })}
                                </text>
                              </g>
                            )
                          })}

                          {/* Grid vertical */}
                          {points.map((point, i) => {
                            if (i % Math.max(1, Math.floor(points.length / 6)) === 0) {
                              return (
                                <line
                                  key={i}
                                  x1={point.x}
                                  y1={paddingTop}
                                  x2={point.x}
                                  y2={paddingTop + plotHeight}
                                  stroke="#f9fafb"
                                  strokeWidth="1"
                                />
                              )
                            }
                            return null
                          })}

                          {/* Área bajo la curva con gradiente */}
                          <defs>
                            <linearGradient id="salesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05"/>
                            </linearGradient>
                            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(59, 130, 246, 0.2)"/>
                            </filter>
                          </defs>

                          <path
                            d={areaPath}
                            fill="url(#salesGradient)"
                          />
                          
                          {/* Línea principal con sombra */}
                          <path
                            d={smoothPath}
                            stroke="#3b82f6"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#shadow)"
                          />
                          
                          {/* Puntos interactivos */}
                          {points.map((point, i) => (
                            <g key={i}>
                              <circle
                                cx={point.x}
                                cy={point.y}
                                r="6"
                                fill="white"
                                stroke="#3b82f6"
                                strokeWidth="3"
                                className="hover:r-8 transition-all duration-200 cursor-pointer"
                              />
                              <circle
                                cx={point.x}
                                cy={point.y}
                                r="3"
                                fill="#3b82f6"
                              />
                              {/* Tooltip invisible para hover */}
                              <circle
                                cx={point.x}
                                cy={point.y}
                                r="12"
                                fill="transparent"
                                className="hover:fill-blue-50 cursor-pointer"
                              >
                                <title>{`${formatDate(point.date)}: ${point.value.toLocaleString('es-CL')}`}</title>
                              </circle>
                            </g>
                          ))}

                          {/* Etiquetas del eje X */}
                          {points.map((point, i) => {
                            if (i % Math.max(1, Math.floor(points.length / 6)) === 0 || i === points.length - 1) {
                              return (
                                <text
                                  key={i}
                                  x={point.x}
                                  y={paddingTop + plotHeight + 20}
                                  textAnchor="middle"
                                  className="text-xs fill-gray-600"
                                >
                                  {formatDate(point.date)}
                                </text>
                              )
                            }
                            return null
                          })}

                          {/* Líneas de los ejes */}
                          <line
                            x1={paddingLeft}
                            y1={paddingTop + plotHeight}
                            x2={paddingLeft + plotWidth}
                            y2={paddingTop + plotHeight}
                            stroke="#e5e7eb"
                            strokeWidth="2"
                          />
                          <line
                            x1={paddingLeft}
                            y1={paddingTop}
                            x2={paddingLeft}
                            y2={paddingTop + plotHeight}
                            stroke="#e5e7eb"
                            strokeWidth="2"
                          />
                        </svg>

                        {/* Leyenda */}
                        <div className="flex items-center justify-center mt-4 space-x-6 text-sm text-gray-600">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                            <span>Ventas diarias</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-1 bg-gradient-to-r from-blue-500 to-blue-200 rounded mr-2"></div>
                            <span>Tendencia</span>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <div className="text-center">
                    <div className="text-4xl text-gray-300 mb-2">📊</div>
                    <p className="text-sm font-medium">No hay ventas registradas</p>
                    <p className="text-xs text-gray-400 mt-1">en este período</p>
                  </div>
                </div>
              )}
            </div>

            {/* Columna de información de productos */}
            <div className="space-y-4">
              {/* Producto más vendido */}
              <div className="p-4 bg-white rounded-lg shadow">
                <p className="text-sm text-gray-500 mb-2">Producto más vendido</p>
                {summary.best_selling_product ? (
                  <>
                    <p className="font-medium text-gray-800">
                      {summary.best_selling_product.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Cantidad: {summary.best_selling_product.quantity}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No hay productos vendidos en este período
                  </p>
                )}
              </div>

              {/* Productos con stock bajo */}
              <div className="p-4 bg-white rounded-lg shadow">
                <p className="text-sm font-medium text-gray-800 mb-3">
                  Productos con stock bajo
                </p>
                {summary.low_stock_products.length > 0 ? (
                  <ul className="space-y-2">
                    {summary.low_stock_products.map((p) => (
                      <li key={p.id} className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">{p.name}</span>
                        <span className="text-sm text-orange-600 font-medium">
                          {p.stock}/{p.stock_minimum}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No hay productos con stock bajo
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard