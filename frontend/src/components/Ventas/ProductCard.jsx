// src/components/ventas/ProductCard.jsx
function ProductCard({ product, quantity, onQuantityChange, onAdd }) {
  const isOutOfStock = product.stock === 0
  const isLowStock = product.stock <= 5 && product.stock > 0

  return (
    <div className={`group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] overflow-hidden ${
      isOutOfStock ? 'opacity-60' : ''
    }`}>
      {/* Badge de stock */}
      {isOutOfStock && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium z-10">
          Sin stock
        </div>
      )}
      {isLowStock && (
        <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium z-10">
          Stock bajo
        </div>
      )}

      {/* Imagen del producto */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-3 flex items-center justify-center h-32">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDdMMTYgM0g4TDQgN1YxN0E0IDQgMCAwIDAgOCAyMUgxNkE0IDQgMCAwIDAgMjAgMTdWN1oiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTkgMTFBMyAzIDAgMCAwIDE1IDExIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo='
          }}
        />
      </div>

      {/* Información del producto */}
      <div className="p-3">
        <h3 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500">Stock:</span>
            <span className={`font-medium text-xs ${
              isOutOfStock ? 'text-red-500' : 
              isLowStock ? 'text-amber-500' : 
              'text-green-600'
            }`}>
              {product.stock}
            </span>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              ${product.price.toLocaleString('es-CL')}
            </div>
            <div className="text-xs text-gray-500">
              c/u
            </div>
          </div>
        </div>

        {/* Controles de cantidad */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <label className="text-xs font-medium text-gray-700">
              Cantidad:
            </label>
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors duration-200 flex items-center justify-center"
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
                className="w-10 px-1 py-1 text-center border-0 focus:ring-0 focus:outline-none text-xs"
                disabled={isOutOfStock}
              />
              <button
                onClick={() => onQuantityChange(Math.min(product.stock, quantity + 1))}
                className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors duration-200 flex items-center justify-center"
                disabled={isOutOfStock || quantity >= product.stock}
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>

          <button
            onClick={onAdd}
            disabled={isOutOfStock || quantity > product.stock}
            className={`flex items-center justify-center space-x-1 px-3 py-2 rounded-md font-medium transition-all duration-200 w-full ${
              isOutOfStock || quantity > product.stock
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95'
            }`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-xs">Agregar</span>
          </button>
        </div>

        {/* Mensaje de validación */}
        {quantity > product.stock && (
          <div className="mt-2 text-xs text-red-500 flex items-center">
            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Cantidad máxima: {product.stock}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCard