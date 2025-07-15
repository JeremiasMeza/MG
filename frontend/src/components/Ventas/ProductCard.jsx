// src/components/ventas/ProductCard.jsx
function ProductCard({ product, quantity, onQuantityChange, onAdd }) {
  return (
    <div className="border rounded p-2 shadow hover:shadow-md transition flex flex-col items-center">
      <img
        src={product.image}
        alt={product.name}
        className="h-24 object-contain mb-2"
      />
      <h3 className="font-medium text-center">{product.name}</h3>
      <p className="text-sm">stock: {product.stock}</p>
      <p className="text-sm mb-2">Precio: ${product.price}</p>

      <div className="flex items-center space-x-2">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => onQuantityChange(parseInt(e.target.value, 10) || 1)}
          className="border w-12 text-center rounded"
        />
        <button
          onClick={onAdd}
          className="bg-green-200 px-2 py-1 rounded hover:bg-green-300"
        >
          🛒
        </button>
      </div>
    </div>
  )
}

export default ProductCard