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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden transform animate-in slide-in-from-bottom-4 duration-300">
        {/* Header - Aplicando el diseño azul del modal original */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-lg p-2">
              {product ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {product ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <p className="text-blue-100 text-sm opacity-90">
                {product ? 'Modificar información del producto' : 'Agregar producto al inventario'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 flex items-center gap-2 hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cerrar
          </button>
        </div>

        {/* Contenido principal del formulario */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="p-6 flex-1 overflow-y-auto">
            
            {/* Información básica del producto */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 mb-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 rounded-lg p-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 text-lg">Información Básica</h4>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Nombre del producto *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Ingrese el nombre del producto"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Código de barras
                  </label>
                  <input
                    type="text"
                    name="barcode"
                    value={form.barcode}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono"
                    placeholder="123456789012"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Categoría *
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
              </div>
            </div>

            {/* Información de precios */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 mb-6 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 rounded-lg p-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 text-lg">Información de Precios</h4>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Precio de venta * ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="0"
                      required
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Costo del producto ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                    <input
                      type="number"
                      name="cost"
                      value={form.cost}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Información de inventario */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-5 mb-6 border border-orange-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-100 rounded-lg p-2">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 text-lg">Control de Inventario</h4>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Stock actual * (unidades)
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="0"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Stock mínimo * (unidades)
                  </label>
                  <input
                    type="number"
                    name="stock_minimum"
                    value={form.stock_minimum}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="0"
                    required
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Imagen del producto */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 rounded-lg p-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 text-lg">Imagen del Producto</h4>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Subir imagen (opcional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    accept="image/*"
                    className="w-full border-2 border-dashed border-purple-300 rounded-lg px-4 py-6 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Formatos soportados: JPG, PNG, GIF (máx. 5MB)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer con botones */}
          <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl px-6 py-3 font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
              >
                {product ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Actualizar Producto
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Crear Producto
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductFormModal