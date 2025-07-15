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
    <div className="w-full md:w-64 bg-white rounded shadow p-4">
      <h3 className="text-xl font-semibold mb-4">Carrito</h3>
      <p>Productos: {cart.reduce((sum, it) => sum + it.quantity, 0)}</p>
      <p>Valor neto: ${net.toFixed(4)}</p>
      <p>IVA: ${iva.toFixed(4)}</p>
      <p className="font-bold text-lg mt-2">Total: ${total.toFixed(3)}</p>

      <ul className="mt-4 space-y-2 max-h-48 overflow-auto">
        {cart.map((item) => (
          <li key={item.id} className="text-sm flex justify-between items-center">
            <span>{item.name} x{item.quantity}</span>
            <button
              onClick={() => onRemove(item.id)}
              className="text-red-500 hover:underline text-xs"
            >
              eliminar
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 space-y-2">
        <input
          type="text"
          name="client_first_name"
          value={saleInfo.client_first_name}
          onChange={(e) => onSaleInfoChange({ ...saleInfo, client_first_name: e.target.value })}
          placeholder="Nombre cliente"
          className="border p-1 w-full text-sm"
        />
        <input
          type="text"
          name="client_last_name"
          value={saleInfo.client_last_name}
          onChange={(e) => onSaleInfoChange({ ...saleInfo, client_last_name: e.target.value })}
          placeholder="Apellido cliente"
          className="border p-1 w-full text-sm"
        />
        <input
          type="text"
          name="client_rut"
          value={saleInfo.client_rut}
          onChange={(e) => onSaleInfoChange({ ...saleInfo, client_rut: e.target.value })}
          placeholder="RUT"
          className="border p-1 w-full text-sm"
        />
        <input
          type="email"
          name="client_email"
          value={saleInfo.client_email}
          onChange={(e) => onSaleInfoChange({ ...saleInfo, client_email: e.target.value })}
          placeholder="Email"
          className="border p-1 w-full text-sm"
        />
        <select
          className="border p-1 w-full text-sm"
          name="payment_method"
          value={saleInfo.payment_method}
          onChange={(e) => onSaleInfoChange({ ...saleInfo, payment_method: e.target.value })}
        >
          <option value="">Método de pago</option>
          {paymentMethods.map((pm) => (
            <option key={pm.id} value={pm.id}>
              {pm.method_name}
            </option>
          ))}
        </select>
        <button
          className="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded"
          onClick={onFinish}
        >
          Finalizar Venta
        </button>
      </div>
    </div>
  )
}

export default CartSummary