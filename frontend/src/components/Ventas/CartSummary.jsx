// src/components/ventas/CartSummary.jsx
function CartSummary({
  cart,
  onRemove,
  paymentMethods = [],
  saleInfo,
  onSaleInfoChange,
  onFinish,
}) {
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const net = total / 1.19
  const iva = total - net

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full">
      {/* Header del carrito */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">Carrito</h3>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {cart.reduce((sum, it) => sum + it.quantity, 0)} items
        </div>
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
            <p className="text-gray-500 font-medium">Carrito vacío</p>
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
        <h4 className="font-medium text-gray-800 mb-4">Información del Cliente</h4>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                name="client_first_name"
                value={saleInfo.client_first_name}
                onChange={(e) => onSaleInfoChange({ ...saleInfo, client_first_name: e.target.value })}
                placeholder="Juan"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                name="client_last_name"
                value={saleInfo.client_last_name}
                onChange={(e) => onSaleInfoChange({ ...saleInfo, client_last_name: e.target.value })}
                placeholder="Pérez"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              RUT
            </label>
            <input
              type="text"
              name="client_rut"
              value={saleInfo.client_rut}
              onChange={(e) => onSaleInfoChange({ ...saleInfo, client_rut: e.target.value })}
              placeholder="12.345.678-9"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="client_email"
              value={saleInfo.client_email}
              onChange={(e) => onSaleInfoChange({ ...saleInfo, client_email: e.target.value })}
              placeholder="cliente@ejemplo.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Método de Pago
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
              name="payment_method"
              value={saleInfo.payment_method}
              onChange={(e) => onSaleInfoChange({ ...saleInfo, payment_method: e.target.value })}
            >
              <option value="">Seleccionar método</option>
              {paymentMethods.map((pm) => (
                <option key={pm.id} value={pm.id}>
                  {pm.method_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Botón de finalizar */}
      <button
        className={`w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-200 ${
          cart.length === 0
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]'
        }`}
        onClick={onFinish}
        disabled={cart.length === 0}
      >
        {cart.length === 0 ? (
          <span className="flex items-center justify-center">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Carrito vacío
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Finalizar Venta
          </span>
        )}
      </button>
    </div>
  )
}

export default CartSummary