import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

function Layout({ user, onLogout }) {
  return (
    <div className="flex h-screen">
      <Sidebar user={user} onLogout={onLogout} />
      <main className="flex-1 bg-gray-100">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
