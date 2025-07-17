// src/components/ProductDetailModal.jsx
function ProductDetailModal({ open, onClose, product }) {
  if (!open || !product) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex-1">
            {product.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &#10005;
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-60 object-contain"
              onError={(e) => {
                e.target.src =
                  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDdMMTYgM0g4TDQgN1YxN0E0IDQgMCAwIDAgOCAyMUgxNkE0IDQgMCAwIDAgMjAgMTdWN1oiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTkgMTFBMyAzIDAgMCAwIDE1IDExIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo='
              }}
            />
          </div>
          <div className="space-y-2 text-sm">
            {product.barcode && (
              <p>
                <span className="font-medium text-gray-700">Código de barras:</span>{' '}
                {product.barcode}
              </p>
            )}
            <p>
              <span className="font-medium text-gray-700">Precio:</span>{' '}
              {product.price.toLocaleString('es-CL', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </p>
            <p>
              <span className="font-medium text-gray-700">Stock:</span>{' '}
              {product.stock}
            </p>
            {product.stock_minimum !== undefined && (
              <p>
                <span className="font-medium text-gray-700">Stock mínimo:</span>{' '}
                {product.stock_minimum}
              </p>
            )}
            {product.description && (
              <p className="whitespace-pre-line">{product.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailModal

