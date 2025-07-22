// src/components/inventario/InventoryRow.jsx
function InventoryRow({ product, onEdit, onDelete }) {
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
        <div className="relative w-16 h-16 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-300">
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
            <h3 className="font-semibold text-sm text-gray-900 leading-tight">
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

              {/* Stock mínimo */}
              {product.stock_minimum && (
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">Min:</span>
                  <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-0.5 rounded">
                    {product.stock_minimum}
                  </span>
                </div>
              )}
            </div>

            {/* Precio destacado */}
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                ${product.price.toLocaleString('es-CL', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </div>
              <div className="text-xs text-gray-500">precio unitario</div>
            </div>
          </div>
        </div>

        {/* Controles de acción mejorados */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={() => onEdit(product)}
            className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 transform bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="hidden sm:inline">Editar</span>
          </button>
          
          <button
            onClick={() => onDelete(product)}
            className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 transform bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="hidden sm:inline">Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default InventoryRow