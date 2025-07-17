// src/components/ventas/ProductRow.jsx
function ProductRow({ product, quantity, onQuantityChange, onAdd }) {
  const isOutOfStock = product.stock === 0
  const isBelowMinimum = product.stock < product.stock_minimum

  return (
    <div
      className={`flex items-center space-x-3 bg-white rounded-lg shadow p-3 ${
        isOutOfStock ? 'opacity-60' : ''
      }`}
    >
      {/* Imagen */}
      <div className="w-14 h-14 flex items-center justify-center bg-gray-50 rounded">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain"
          onError={(e) => {
            e.target.src =
              'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDdMMTYgM0g4TDQgN1YxN0E0IDQgMCAwIDAgOCAyMUgxNkE0IDQgMCAwIDAgMjAgMTdWN1oiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTkgMTFBMyAzIDAgMCAwIDE1IDExIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo='
          }}
        />
      </div>
      {/* Información */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm text-gray-900 truncate">{product.name}</h3>
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-gray-500">Stock:</span>
          <span
            className={`font-medium ${
              isOutOfStock
                ? 'text-red-500'
                : isBelowMinimum
                ? 'text-orange-600'
                : 'text-green-600'
            }`}
          >
            {product.stock}
          </span>
          <span className="ml-2 font-bold text-gray-900">
            {product.price.toLocaleString('es-CL', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </span>
        </div>
      </div>
      {/* Controles */}
      <div className="flex items-center space-x-2">
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
        <button
          onClick={onAdd}
          disabled={isOutOfStock || quantity > product.stock}
          className={`flex items-center justify-center space-x-1 px-3 py-2 rounded-md font-medium transition-all duration-200 ${
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
    </div>
  )
}

export default ProductRow
