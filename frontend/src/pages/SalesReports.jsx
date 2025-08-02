import { useState, useEffect } from 'react'
import DataTable from '@components/DataTable.jsx'
import { fetchAll } from '../api.js'
import useSaleDetails from '../hooks/useSaleDetails.js'
import SaleDetailsModal from '../components/SaleDetailsModal.jsx'

function ReportesVentas() {
  const today = new Date().toISOString().slice(0, 10)
  const first = today.slice(0, 8) + '01'
  const [startDate, setStartDate] = useState(first)
  const [endDate, setEndDate] = useState(today)
  const [sales, setSales] = useState([])
  const [products, setProducts] = useState([])
  const [prodFilter, setProdFilter] = useState('')

  const [loading, setLoading] = useState(false)
  const {
    selectedSale,
    receiptUrl,
    openSale,
    closeSale,
  } = useSaleDetails()

  const loadData = async () => {
    setLoading(true)
    const [salesData, productsData] = await Promise.all([
      fetchAll('sales/'),
      fetchAll('products/'),
    ])
    setSales(salesData)
    setProducts(productsData)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  // Filtro corregido - comparando fechas como strings
  const filtered = sales.filter((s) => {
    // Convertir la fecha de venta a formato YYYY-MM-DD
    const saleDate = new Date(s.sale_date).toISOString().slice(0, 10)
    return (
      saleDate >= startDate &&
      saleDate <= endDate &&
      (prodFilter === '' || s.details.some((dt) => dt.product_id === parseInt(prodFilter)))
    )
  })

  const productMap = Object.fromEntries(products.map((p) => [p.id, p]))


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

      </div>

      {/* Sales Report - Full Width */}
      <div className="h-[calc(100vh-16rem)] overflow-hidden">
        <div className="bg-white p-4 rounded-lg shadow flex flex-col h-full">
          <h3 className="font-semibold mb-4 text-lg">Reporte de Ventas</h3>
          <div className="flex-1 overflow-y-auto">
            <DataTable
              headers={["Fecha", "ID", "Cliente", "Total"]}
              rows={filtered.map((s) => [
                new Date(s.sale_date).toLocaleDateString(),
                s.id,
                `${s.client_first_name} ${s.client_last_name}`,
                parseFloat(s.total).toLocaleString('es-CL', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })
              ])}
              onRowClick={(row, i) => openSale(filtered[i])}
            />
          </div>
          {filtered.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Total de ventas: <span className="font-semibold">{filtered.length}</span>
              </p>
              <p className="text-sm text-gray-600">
                Monto total: <span className="font-semibold">
                  {filtered.reduce((sum, s) => sum + parseFloat(s.total), 0).toLocaleString('es-CL', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-sm">Cargando...</p>
          </div>
        </div>
      )}

      <SaleDetailsModal
        sale={selectedSale}
        onClose={closeSale}
        productMap={productMap}
        receiptUrl={receiptUrl}
      />
    </div>
  )
}

export default ReportesVentas