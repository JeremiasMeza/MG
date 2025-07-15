import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

function Layout({ user }) {
  return (
    <div className="flex h-screen">
      <Sidebar user={user} />
      <main className="flex-1 bg-gray-100 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
