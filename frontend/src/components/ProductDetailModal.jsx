// src/components/ProductDetailModal.jsx
function ProductDetailModal({ open, onClose, product }) {
  if (!open || !product) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-[32rem] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {product.name}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 text-white rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cerrar
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
          <div className="flex items-center justify-center">
            <img
              src={product.image || '/images/product-placeholder.svg'}
              alt={product.name}
              className="max-h-60 object-contain"
              onError={(e) => {
                e.target.src = '/images/product-placeholder.svg'
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

