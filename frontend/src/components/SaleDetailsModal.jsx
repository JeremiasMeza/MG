import React from 'react'

function SaleDetailsModal({ sale, onClose, productMap, receiptUrl }) {
  if (!sale) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold">Venta #{sale.id}</h3>
          <button
            type="button"
            onClick={onClose}
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
            {sale.client_first_name} {sale.client_last_name}
          </p>
          <p>
            <span className="font-medium">RUT:</span> {sale.client_rut}
          </p>
          <p>
            <span className="font-medium">Fecha:</span>{' '}
            {new Date(sale.sale_date).toLocaleString()}
          </p>
          <p>
            <span className="font-medium">Total:</span>{' '}
            {parseFloat(sale.total).toLocaleString('es-CL', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })}
          </p>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Detalles</h4>
            <ul className="space-y-1 max-h-60 overflow-y-auto text-sm">
              {sale.details.map((d, i) => (
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
    </div>
  )
}

export default SaleDetailsModal
