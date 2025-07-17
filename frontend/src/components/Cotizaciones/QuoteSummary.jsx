import React from 'react'

function QuoteSummary({
  cart,
  onRemove,
  quoteInfo,
  onQuoteInfoChange,
  onFinish,
  onShowQuotes,
}) {
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const net = total / 1.19
  const iva = total - net

  const isFormValid =
    cart.length > 0 &&
    quoteInfo.client_name.trim() !== '' &&
    quoteInfo.client_rut.trim() !== ''

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">Cotizar</h3>
        <button
          onClick={onShowQuotes}
          className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Ver Cotizaciones
        </button>
      </div>

      {/* Lista de productos */}
      <div className="mb-6">
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-3">
              <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">Sin productos</p>
            <p className="text-gray-400 text-sm mt-1">Agrega productos para comenzar</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{item.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm font-medium text-gray-700">
                      {(item.price * item.quantity).toLocaleString('es-CL', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="ml-3 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Eliminar producto"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resumen de precios */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Valor neto:</span>
            <span>${net.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>IVA (19%):</span>
            <span>${iva.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-100">
            <span>Total:</span>
            <span>${total.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
          </div>
        </div>
      </div>

      {/* Información del cliente */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-800 mb-4">Datos del Cliente</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              name="client_name"
              value={quoteInfo.client_name}
              onChange={(e) => onQuoteInfoChange({ ...quoteInfo, client_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">RUT</label>
            <input
              type="text"
              name="client_rut"
              value={quoteInfo.client_rut}
              onChange={(e) => onQuoteInfoChange({ ...quoteInfo, client_rut: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="client_email"
              value={quoteInfo.client_email}
              onChange={(e) => onQuoteInfoChange({ ...quoteInfo, client_email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Botón generar */}
      <button
        className={`w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-200 ${
          isFormValid
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
        onClick={onFinish}
        disabled={!isFormValid}
      >
        Generar Cotización
      </button>
    </div>
  )
}

export default QuoteSummary

