// src/components/inventario/ProductFormModal.jsx
import { useState, useEffect } from 'react'

function ProductFormModal({ open, onClose, onSave, product, categories }) {
  const [form, setForm] = useState({
    name: '',
    price: 0,
    cost: 0,
    barcode: '',
    stock: 0,
    stock_minimum: 0,
    category: '',
    image: null,
  })

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        price: product.price || 0,
        cost: product.cost || 0,
        barcode: product.barcode || '',
        stock: product.stock || 0,
        stock_minimum: product.stock_minimum || 0,
        category: product.category || '',
        image: null,
      })
    } else {
      setForm({
        name: '',
        price: 0,
        cost: 0,
        barcode: '',
        stock: 0,
        stock_minimum: 0,
        category: '',
        image: null,
      })
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'image') {
      setForm((prev) => ({ ...prev, image: e.target.files[0] }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = new FormData()
    data.append('name', form.name)
    data.append('price', form.price)
    data.append('cost', form.cost)
    data.append('barcode', form.barcode)
    data.append('stock', form.stock)
    data.append('stock_minimum', form.stock_minimum)
    data.append('category', form.category)
    if (form.image) data.append('image', form.image)
    onSave(data)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-[60%] h-[50%] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
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
        <form onSubmit={handleSubmit} className="space-y-3 p-6 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Precio</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Costo</label>
            <input
              type="number"
              name="cost"
              value={form.cost}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Código de barras</label>
            <input
              type="text"
              name="barcode"
              value={form.barcode}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock mínimo</label>
              <input
                type="number"
                name="stock_minimum"
                value={form.stock_minimum}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Imagen</label>
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>
      <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductFormModal
