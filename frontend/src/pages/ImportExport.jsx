import { useState } from 'react'

function ImportExport() {
  const token = localStorage.getItem('access')
  const headers = { Authorization: `Bearer ${token}` }
  const [file, setFile] = useState(null)
  const [isUploading, setUploading] = useState(false)

  const handleExport = async () => {
    const resp = await fetch('http://192.168.1.52:8000/api/import-export/', { headers })
    const blob = await resp.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'productos.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleImport = async (e) => {
    e.preventDefault()
    if (!file) return
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    try {
      const resp = await fetch('http://192.168.1.52:8000/api/import-export/', {
        method: 'POST',
        headers,
        body: form,
      })
      if (!resp.ok) throw new Error('Error al importar')
      alert('Importación completada')
      setFile(null)
    } catch (err) {
      alert(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-6 space-y-4 bg-gray-50 h-full">
      <h2 className="text-2xl font-bold text-gray-800">Importar / Exportar</h2>
      <div className="space-y-3">
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Exportar CSV
        </button>
        <form onSubmit={handleImport} className="space-x-2 inline-block">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            type="submit"
            disabled={isUploading || !file}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-green-400"
          >
            {isUploading ? 'Importando...' : 'Importar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ImportExport
