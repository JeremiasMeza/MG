// src/components/inventario/InventoryRow.jsx
function InventoryRow({ product, onEdit, onDelete }) {
  const isOutOfStock = product.stock === 0
  const isLowStock = product.stock <= product.stock_minimum && product.stock > 0

  return (
    <div
      className={`flex items-center space-x-3 bg-white rounded-lg shadow p-3 ${
        isOutOfStock ? 'opacity-60' : ''
      }`}
    >
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
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm text-gray-900 truncate">{product.name}</h3>
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-gray-500">Stock:</span>
          <span
            className={`font-medium ${
              isOutOfStock ? 'text-red-500' : isLowStock ? 'text-amber-500' : 'text-green-600'
            }`}
          >
            {product.stock}
          </span>
          <span className="ml-2 font-bold text-gray-900">
            ${product.price.toLocaleString('es-CL')}
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onEdit(product)}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(product)}
          className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs"
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}

export default InventoryRow
