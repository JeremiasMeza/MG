// src/components/inventario/InventoryRow.jsx
function InventoryRow({ product, onEdit, onDelete }) {
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
          {product.stock_minimum && (
            <>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500">Min:</span>
              <span className="font-medium text-gray-600">{product.stock_minimum}</span>
            </>
          )}
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
        <button
          onClick={() => onEdit(product)}
          className="flex items-center justify-center space-x-1 px-3 py-2 rounded-md font-medium transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="text-xs">Editar</span>
        </button>
        
        <button
          onClick={() => onDelete(product)}
          className="flex items-center justify-center space-x-1 px-3 py-2 rounded-md font-medium transition-all duration-200 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="text-xs">Eliminar</span>
        </button>
      </div>
    </div>
  )
}

export default InventoryRow