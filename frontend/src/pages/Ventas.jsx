// src/pages/Ventas.jsx
import { useState, useEffect } from 'react'
import ProductCard from '@components/ventas/ProductCard.jsx'
import CartSummary from '@components/ventas/CartSummary.jsx'
import Pagination from '@components/ventas/Pagination.jsx'

const PER_PAGE = 6

function Ventas() {
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('')
  const [qtyMap, setQtyMap] = useState({})
  const [cart, setCart] = useState([])
  const [page, setPage] = useState(1)
  const [saleInfo, setSaleInfo] = useState({
    client_first_name: '',
    client_last_name: '',
    client_rut: '',
    client_email: '',
    payment_method: '',
  })

  useEffect(() => {
    const token = localStorage.getItem('access')
    const headers = { Authorization: `Bearer ${token}` }
    fetch('http://localhost:8000/api/products/', { headers })
      .then((r) => r.json())
      .then(setProducts)
      .catch((e) => console.error(e))
    fetch('http://localhost:8000/api/categories/', { headers })
      .then((r) => r.json())
      .then(setCategories)
      .catch((e) => console.error(e))
    fetch('http://localhost:8000/api/payment-methods/', { headers })
      .then((r) => r.json())
      .then(setPaymentMethods)
      .catch((e) => console.error(e))
  }, [])

  const filtered = products.filter(
    (p) =>
      (categoryFilter === '' || p.category === parseInt(categoryFilter)) &&
      (p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.barcode || '').toLowerCase().includes(query.toLowerCase()))
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

  const handleFinishSale = async () => {
    if (cart.length === 0) return
    const token = localStorage.getItem('access')
    const payload = {
      ...saleInfo,
      payment_method: saleInfo.payment_method || null,
      details: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    }
    try {
      const resp = await fetch('http://localhost:8000/api/sales/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      if (!resp.ok) throw new Error('Error al registrar venta')
      alert('Venta registrada')
      setCart([])
      setQtyMap({})
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="p-4 md:p-6 text-gray-800">
      <h2 className="text-2xl font-bold mb-4">Ventas</h2>
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0 mb-6">
        <select
          className="border p-2 rounded bg-blue-200"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
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
        <CartSummary
          cart={cart}
          onRemove={handleRemove}
          paymentMethods={paymentMethods}
          saleInfo={saleInfo}
          onSaleInfoChange={setSaleInfo}
          onFinish={handleFinishSale}
        />
      </div>

      {/* Paginación */}
      <Pagination page={page} totalPages={pageCount} onPageChange={setPage} />
    </div>
  )
}

export default Ventas
