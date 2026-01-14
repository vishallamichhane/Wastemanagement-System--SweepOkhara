import React from 'react'
import Header from './components/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../../components/Footer'

function Layout() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-blue-50 to-emerald-100 text-gray-900 relative overflow-hidden">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </>
  )
}

export default Layout