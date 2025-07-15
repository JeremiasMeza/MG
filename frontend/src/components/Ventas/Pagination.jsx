// src/components/ventas/Pagination.jsx
function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="mt-6 flex justify-center items-center space-x-2">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        className="px-2 text-xl"
      >
        {'<'}
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => onPageChange(n)}
          className={`px-2 rounded ${
            page === n ? 'font-bold text-black' : 'text-gray-400'
          }`}
        >
          {n}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        className="px-2 text-xl"
      >
        {'>'}
      </button>
    </div>
  )
}

export default Pagination