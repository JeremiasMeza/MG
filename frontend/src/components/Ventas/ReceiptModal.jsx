// src/components/ventas/ReceiptModal.jsx
function ReceiptModal({ open, onClose, pdfUrl }) {
  if (!open) return null

  const handlePrint = () => {
    const win = window.open(pdfUrl, '_blank')
    if (win) {
      win.addEventListener('load', () => {
        win.print()
      })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-[32rem] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Compra finalizada</h2>
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
        <div className="p-6 space-y-4 text-center">
          <p className="text-lg font-medium text-gray-700">¡Compra finalizada con éxito!</p>
          <div className="flex justify-center gap-3">
            <a
              href={pdfUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
            >
              Descargar Boleta
            </a>
            <button
              onClick={handlePrint}
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200"
            >
              Imprimir
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReceiptModal
