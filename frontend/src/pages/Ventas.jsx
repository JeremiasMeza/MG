// src/pages/Ventas.jsx
import { useState, useEffect } from 'react'
import ProductCard from '@components/ventas/ProductCard.jsx'
import CartSummary from '@components/ventas/CartSummary.jsx'
import Pagination from '@components/ventas/Pagination.jsx'  





const INVENTORY = Array(15).fill(0).map((_, i) => ({
  id: i + 1,
  code: `PRD${String(i + 1).padStart(3, '0')}`,
  name: 'Tornillos 1 5/8',
  price: 400,
  stock: 20,
  image: '/tornillo.png', // debes tener esta imagen en /public
}))

const PER_PAGE = 6

function Ventas() {
  const [query, setQuery] = useState('')
  const [qtyMap, setQtyMap] = useState({})
  const [cart, setCart] = useState([])
  const [page, setPage] = useState(1)

  const filtered = INVENTORY.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.code.toLowerCase().includes(query.toLowerCase())
  )

  const pageCount = Math.ceil(filtered.length / PER_PAGE)
  const productsToShow = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleAdd = (product) => {
    const qty = qtyMap[product.id] || 1
    if (qty < 1 || qty > product.stock) return
    setCart((prev) => {
      const existing = prev.find((it) => it.id === product.id)
      if (existing) {
        const updatedQty = existing.quantity + qty
        if (updatedQty > product.stock) return prev
        return prev.map((it) =>
          it.id === product.id ? { ...it, quantity: updatedQty } : it
        )
      }
      return [...prev, { ...product, quantity: qty }]
    })
  }

  const handleQtyChange = (id, val) => {
    setQtyMap((prev) => ({ ...prev, [id]: val }))
  }

  const handleRemove = (id) => {
    setCart((prev) => prev.filter((it) => it.id !== id))
  }

  return (
    <div className="p-4 md:p-6 text-gray-800">
      <h2 className="text-2xl font-bold mb-4">Ventas</h2>
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0 mb-6">
        <select className="border p-2 rounded bg-blue-200">
          <option value="">Categorías</option>
        </select>
        <input
          type="text"
          placeholder="nombre / código de barra"
          className="border p-2 rounded flex-1 bg-blue-100"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-4">
        {/* Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
          {productsToShow.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              quantity={qtyMap[p.id] || 1}
              onQuantityChange={(val) => handleQtyChange(p.id, val)}
              onAdd={() => handleAdd(p)}
            />
          ))}
        </div>

        {/* Carrito */}
        <CartSummary cart={cart} onRemove={handleRemove} />
      </div>

      {/* Paginación */}
      <Pagination page={page} totalPages={pageCount} onPageChange={setPage} />
    </div>
  )
}

export default Ventas
