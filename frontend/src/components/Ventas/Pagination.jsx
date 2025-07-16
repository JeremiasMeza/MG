// src/components/ventas/Pagination.jsx
function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages = [1]
    let start = Math.max(2, page - 1)
    let end = Math.min(totalPages - 1, page + 1)
    if (start > 2) pages.push('...')
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < totalPages - 1) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  const pages = getPages()

  return (
    <div className="mt-6 flex justify-center items-center space-x-2">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        className="px-2 text-xl"
      >
        {'<'}
      </button>
      {pages.map((n, idx) =>
        n === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-2">
            ...
          </span>
        ) : (
          <button
            key={n}
            onClick={() => onPageChange(n)}
            className={`px-2 rounded ${
              page === n ? 'font-bold text-black' : 'text-gray-400'
            }`}
          >
            {n}
          </button>
        )
      )}
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
