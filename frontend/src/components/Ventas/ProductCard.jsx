// src/components/ventas/ProductCard.jsx
function ProductCard({ product, quantity, onQuantityChange, onAdd, onShowDetails }) {
  const isOutOfStock = product.stock === 0
  const isBelowMinimum = product.stock < product.stock_minimum

  return (
    <div className={`group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden min-h-[320px] flex flex-col ${
      isOutOfStock ? 'opacity-60' : ''
    }`}>
      {/* Badge de stock */}
      {isOutOfStock && (
        <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold z-20 shadow-lg">
          Sin stock
        </div>
      )}
      {!isOutOfStock && isBelowMinimum && (
        <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold z-20 shadow-lg">
          Stock bajo
        </div>
      )}

      {/* Imagen del producto - altura más compacta */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-28 flex-shrink-0 overflow-hidden cursor-pointer" onClick={onShowDetails}>
        <img
          src={product.image || '/images/product-placeholder.svg'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          onError={(e) => {
            e.target.src = '/images/product-placeholder.svg'
          }}
        />
        {/* Overlay sutil para mejorar legibilidad del badge */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
      </div>

      {/* Información del producto */}
      <div className="p-3 flex-1 flex flex-col justify-between min-h-0">
        <div>
          <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem] leading-tight">
            {product.name}
          </h3>
          
          {product.barcode && (
            <p className="text-xs text-gray-500 mb-1 font-mono bg-gray-50 px-2 py-0.5 rounded inline-block">
              {product.barcode}
            </p>
          )}
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Stock:</span>
              <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                isOutOfStock
                  ? 'bg-red-100 text-red-700'
                  : isBelowMinimum
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-1.5 ${
                  isOutOfStock
                    ? 'bg-red-500'
                    : isBelowMinimum
                    ? 'bg-orange-500'
                    : 'bg-green-500'
                }`} />
                {product.stock}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                ${product.price.toLocaleString('es-CL', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </div>
              <div className="text-xs text-gray-500">
                por unidad
              </div>
            </div>
          </div>
        </div>

        {/* Controles de cantidad y botón mejorados */}
        <div className="space-y-2 mt-auto">
          {/* Control de cantidad mejorado */}
          <div className="flex items-center justify-center">
            <span className="text-xs font-medium text-gray-700 mr-3">Cantidad:</span>
            <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-100 text-gray-600 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="w-12 px-2 py-2 text-center border-0 focus:ring-0 focus:outline-none text-sm font-medium bg-transparent"
                disabled={isOutOfStock}
              />
              
              <button
                onClick={() => onQuantityChange(Math.min(product.stock, quantity + 1))}
                className="px-3 py-2 hover:bg-gray-100 text-gray-600 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isOutOfStock || quantity >= product.stock}
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Botón de agregar mejorado significativamente */}
          <button
            onClick={onAdd}
            disabled={isOutOfStock || quantity > product.stock}
            className={`w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 transform ${
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
                <span>Sin stock</span>
              </>
            ) : quantity > product.stock ? (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>Cantidad no válida</span>
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Agregar al carrito</span>
              </>
            )}
          </button>

          {/* Mensaje de validación mejorado */}
          {quantity > product.stock && !isOutOfStock && (
            <div className="flex items-center justify-center space-x-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-lg">
              <svg className="h-3 w-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>Máximo: {product.stock}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard