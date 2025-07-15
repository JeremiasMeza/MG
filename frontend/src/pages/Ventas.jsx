import { useEffect, useState } from 'react'

const INVENTORY = [
  { id: 1, code: 'PRD001', name: 'Silla de Oficina', price: 55, stock: 10 },
  { id: 2, code: 'PRD002', name: 'Mesa de Centro', price: 120, stock: 5 },
  { id: 3, code: 'PRD003', name: 'Lámpara Moderna', price: 35, stock: 8 },
]

function Ventas() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [qty, setQty] = useState(1)
  const [cart, setCart] = useState([])
  const [message, setMessage] = useState('')

  const filtered = INVENTORY.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.code.toLowerCase().includes(query.toLowerCase()),
  )

  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => setMessage(''), 3000)
    return () => clearTimeout(t)
  }, [message])

  const addToCart = () => {
    if (!selected) {
      setMessage('Seleccione un producto')
      return
    }
    if (qty < 1) {
      setMessage('Cantidad inválida')
      return
    }
    if (qty > selected.stock) {
      setMessage('Stock insuficiente')
      return
    }
    setCart((prev) => {
      const existing = prev.find((it) => it.id === selected.id)
      if (existing) {
        if (existing.quantity + qty > selected.stock) {
          setMessage('Stock insuficiente')
          return prev
        }
        return prev.map((it) =>
          it.id === selected.id
            ? { ...it, quantity: it.quantity + qty }
            : it,
        )
      }
      return [...prev, { ...selected, quantity: qty }]
    })
    setMessage('Producto agregado')
    setQuery('')
    setSelected(null)
    setQty(1)
  }

  const removeItem = (id) => {
    setCart((prev) => prev.filter((it) => it.id !== id))
  }

  const total = cart.reduce((acc, it) => acc + it.price * it.quantity, 0)

  return (
    <div className="p-6 space-y-6 text-gray-800">
      <h2 className="text-3xl font-semibold">Ventas</h2>

      {message && (
        <div className="bg-blue-100 text-blue-800 p-2 rounded">{message}</div>
      )}

      <div className="bg-white rounded shadow p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Producto</label>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                const prod = INVENTORY.find(
                  (p) =>
                    p.name.toLowerCase() === e.target.value.toLowerCase() ||
                    p.code.toLowerCase() === e.target.value.toLowerCase(),
                )
                setSelected(prod || null)
              }}
              list="productos"
              placeholder="Nombre o código"
              className="border rounded p-2 w-full"
            />
            <datalist id="productos">
              {filtered.map((p) => (
                <option key={p.id} value={p.name}>{`${p.code} - ${p.name}`}</option>
              ))}
            </datalist>
            {selected && (
              <p className="text-xs text-gray-500 mt-1">
                Stock disponible: {selected.stock}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cantidad</label>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value, 10) || 1)}
              className="border rounded p-2 w-24"
            />
          </div>

          <button
            type="button"
            onClick={addToCart}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center mt-2 sm:mt-0"
          >
            <span className="mr-1">+</span> Agregar al carrito
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Producto</th>
              <th className="px-4 py-2 text-left">Precio unitario</th>
              <th className="px-4 py-2 text-left">Cantidad</th>
              <th className="px-4 py-2 text-left">Subtotal</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">${item.price}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">
                  ${(item.price * item.quantity).toFixed(2)}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {cart.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                  No hay productos en el carrito
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center bg-white rounded shadow p-4">
        <div className="text-lg font-medium mb-4 sm:mb-0">
          Total a pagar: <span className="font-bold">${total.toFixed(2)}</span>
        </div>
        <button
          type="button"
          onClick={() => setMessage('Venta confirmada')}
          className="bg-green-600 text-white px-6 py-3 rounded flex items-center"
        >
          <span className="mr-2">🛒</span> Confirmar venta
        </button>
      </div>
    </div>
  )
}

export default Ventas
