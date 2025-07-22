// src/components/CategoryRow.jsx
import React from 'react'

function CategoryRow({ category, onEdit, onDelete }) {
  return (
    <div className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="flex items-center p-4 space-x-4">
        {/* Icono de categoría con gradiente de fondo */}
        <div className="relative w-16 h-16 flex-shrink-0 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
          <svg className="w-8 h-8 text-indigo-600 transition-transform duration-500 ease-out group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
        </div>

        {/* Información de la categoría expandida */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-sm text-gray-900 leading-tight">
              {category.name}
            </h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Descripción mejorada */}
              {category.description ? (
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">Descripción:</span>
                  <span className="text-xs text-gray-700 bg-gray-50 px-2 py-0.5 rounded max-w-xs truncate">
                    {category.description}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-gray-400 italic">Sin descripción</span>
              )}
              
              {/* Indicador de categoría activa */}
              <div className="flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                <div className="w-1.5 h-1.5 rounded-full mr-1 bg-green-500" />
                Activa
              </div>
            </div>

            {/* Información adicional o badges */}
            <div className="text-right">
              <div className="text-sm font-medium text-gray-600">
                Categoría
              </div>
              <div className="text-xs text-gray-500">ID: {category.id || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Controles de acción mejorados */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={() => onEdit(category)}
            className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 transform bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="hidden sm:inline">Editar</span>
          </button>
          
          <button
            onClick={() => onDelete(category)}
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

export default CategoryRow