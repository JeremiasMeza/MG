// src/components/ventas/CartSummary.jsx
function CartSummary({ cart, onRemove }) {
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

      <button
        className="mt-4 w-full bg-gray-200 hover:bg-gray-300 py-2 rounded"
        onClick={() => alert('Venta finalizada')}
      >
        Finalizar Venta
      </button>
    </div>
  )
}

export default CartSummary