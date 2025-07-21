// src/components/ventas/ProductRow.jsx
function ProductRow({ product, quantity, onQuantityChange, onAdd, onShowDetails }) {
  const isOutOfStock = product.stock === 0
  const isBelowMinimum = product.stock < product.stock_minimum

  return (
    <div
      className={`group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
        isOutOfStock ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-center p-4 space-x-4">
        {/* Badge de sin stock - solo cuando no hay stock */}
        {isOutOfStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10 shadow-md">
            Sin stock
          </div>
        )}

        {/* Imagen mejorada con gradiente de fondo */}
        <div className="relative w-16 h-16 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden cursor-pointer group-hover:scale-105 transition-transform duration-300" onClick={onShowDetails}>
          <img
            src={product.image || '/images/product-placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            onError={(e) => {
              e.target.src = '/images/product-placeholder.svg'
            }}
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
        </div>

        {/* Información del producto expandida */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-sm text-gray-900 leading-tight cursor-pointer hover:text-blue-600 transition-colors duration-200" onClick={onShowDetails}>
              {product.name}
            </h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Código de barras mejorado */}
              {product.barcode && (
                <span className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-0.5 rounded">
                  {product.barcode}
                </span>
              )}
              
              {/* Indicador de stock mejorado */}
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500">Stock:</span>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  isOutOfStock
                    ? 'bg-red-100 text-red-700'
                    : isBelowMinimum
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                    isOutOfStock
                      ? 'bg-red-500'
                      : isBelowMinimum
                      ? 'bg-orange-500'
                      : 'bg-green-500'
                  }`} />
                  {product.stock}
                  {!isOutOfStock && isBelowMinimum && (
                    <span className="ml-1 text-orange-600 font-semibold">• Bajo</span>
                  )}
                </div>
              </div>
            </div>

            {/* Precio destacado */}
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                ${product.price.toLocaleString('es-CL', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </div>
              <div className="text-xs text-gray-500">por unidad</div>
            </div>
          </div>
        </div>

        {/* Controles de cantidad y botón mejorados */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          {/* Control de cantidad con el mismo estilo que las cards */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-gray-700">Qty:</span>
            <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                className="px-2 py-1.5 hover:bg-gray-100 text-gray-600 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isOutOfStock || quantity <= 1}
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 1
                  const clampedVal = Math.min(Math.max(1, val), product.stock)
                  onQuantityChange(clampedVal)
                }}
                onWheel={(e) => e.target.blur()}
                className="w-10 px-1 py-1.5 text-center border-0 focus:ring-0 focus:outline-none text-xs font-medium bg-transparent"
                disabled={isOutOfStock}
              />
              
              <button
                onClick={() => onQuantityChange(Math.min(product.stock, quantity + 1))}
                className="px-2 py-1.5 hover:bg-gray-100 text-gray-600 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isOutOfStock || quantity >= product.stock}
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Botón de agregar con el mismo estilo que las cards */}
          <button
            onClick={onAdd}
            disabled={isOutOfStock || quantity > product.stock}
            className={`flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 transform ${
              isOutOfStock || quantity > product.stock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
            }`}
          >
            {isOutOfStock ? (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <span className="hidden sm:inline">Sin stock</span>
              </>
            ) : quantity > product.stock ? (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="hidden sm:inline">No válido</span>
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="hidden sm:inline">Agregar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mensaje de validación (similar al de las cards) */}
      {quantity > product.stock && !isOutOfStock && (
        <div className="px-4 pb-3">
          <div className="flex items-center justify-center space-x-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-lg">
            <svg className="h-3 w-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>Máximo disponible: {product.stock}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductRow