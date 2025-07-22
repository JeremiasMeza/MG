import React from 'react'

function SummaryCard({ title, value }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
    </div>
  )
}

export default SummaryCard
