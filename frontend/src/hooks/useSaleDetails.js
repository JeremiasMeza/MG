import { useState } from 'react'
import { API_BASE, authHeaders } from '../api.js'

export default function useSaleDetails() {
  const [selectedSale, setSelectedSale] = useState(null)
  const [receiptUrl, setReceiptUrl] = useState('')

  const openSale = async (sale) => {
    setSelectedSale(sale)
    setReceiptUrl('')
    try {
      const resp = await fetch(`${API_BASE}/sales/${sale.id}/export/`, {
        headers: authHeaders()
      })
      if (resp.ok) {
        const data = await resp.json()
        setReceiptUrl(data.pdf_url)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const closeSale = () => {
    setSelectedSale(null)
    setReceiptUrl('')
  }

  return { selectedSale, receiptUrl, openSale, closeSale }
}
