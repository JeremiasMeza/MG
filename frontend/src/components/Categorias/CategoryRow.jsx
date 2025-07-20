import React from 'react'

function CategoryRow({ category, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow">
      <div>
        <p className="font-medium text-gray-800">{category.name}</p>
        {category.description && (
          <p className="text-sm text-gray-500">{category.description}</p>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(category)}
          className="px-3 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(category)}
          className="px-3 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}

export default CategoryRow
