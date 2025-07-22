// src/components/ProductDetailModal.jsx
function ProductDetailModal({ open, onClose, product }) {
  if (!open || !product) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden transform animate-in slide-in-from-bottom-4 duration-300">
        {/* Header - Mantiene el diseño azul consistente */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-lg p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold truncate max-w-md">{product.name}</h2>
              <p className="text-blue-100 text-sm opacity-90">Detalles del producto</p>
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

        {/* Contenido principal */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Sección de imagen */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 rounded-lg p-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 text-lg">Imagen del Producto</h4>
              </div>
              
              <div className="flex items-center justify-center bg-white rounded-xl p-4 min-h-[300px] border-2 border-dashed border-gray-300">
                <img
                  src={product.image || '/images/product-placeholder.svg'}
                  alt={product.name}
                  className="max-h-72 max-w-full object-contain rounded-lg shadow-sm"
                  onError={(e) => {
                    e.target.src = '/images/product-placeholder.svg'
                  }}
                />
              </div>
            </div>

            {/* Sección de información */}
            <div className="space-y-6">
              
              {/* Información básica */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 rounded-lg p-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-800 text-lg">Información Básica</h4>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <span className="text-sm font-medium text-gray-600 block mb-1">Nombre del producto</span>
                    <p className="text-gray-900 font-semibold text-lg">{product.name}</p>
                  </div>
                  
                  {product.barcode && (
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <span className="text-sm font-medium text-gray-600 block mb-1">Código de barras</span>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                        </svg>
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm font-medium text-gray-800">
                          {product.barcode}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Información de precios */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 rounded-lg p-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-800 text-lg">Precio</h4>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <span className="text-sm font-medium text-gray-600 block mb-1">Precio de venta</span>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-green-700">
                      ${product.price ? product.price.toLocaleString('es-CL', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }) : '0'}
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">CLP</span>
                  </div>
                </div>
              </div>

              {/* Información de inventario */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-5 border border-orange-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-orange-100 rounded-lg p-2">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-800 text-lg">Inventario</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-orange-200">
                    <span className="text-sm font-medium text-gray-600 block mb-1">Stock actual</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl font-bold ${product.stock >= (product.stock_minimum || 0) ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock}
                      </span>
                      <span className="text-xs text-gray-500">unidades</span>
                      {product.stock < (product.stock_minimum || 0) && (
                        <div className="bg-red-100 rounded-full p-1">
                          <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {product.stock_minimum !== undefined && (
                    <div className="bg-white rounded-lg p-3 border border-orange-200">
                      <span className="text-sm font-medium text-gray-600 block mb-1">Stock mínimo</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-orange-600">{product.stock_minimum}</span>
                        <span className="text-xs text-gray-500">unidades</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Indicador de estado del stock */}
                <div className="mt-3 p-3 rounded-lg border-2 border-dashed">
                  {product.stock >= (product.stock_minimum || 0) ? (
                    <div className="flex items-center gap-2 text-green-700 border-green-300">
                      <div className="bg-green-100 rounded-full p-1">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Stock disponible</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-700 border-red-300">
                      <div className="bg-red-100 rounded-full p-1">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Stock bajo - Requiere reposición</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Descripción si existe */}
              {product.description && (
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gray-100 rounded-lg p-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-800 text-lg">Descripción</h4>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer informativo */}
        <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <div className="bg-blue-100 rounded-full p-1">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-medium">Información actualizada</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                product.stock >= (product.stock_minimum || 0)
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.stock >= (product.stock_minimum || 0) ? 'Disponible' : 'Stock bajo'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailModal