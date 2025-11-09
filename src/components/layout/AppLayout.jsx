import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import '../../styles/applayout.css'
import '../../styles/sidebar.css'
import '../../styles/header.css'
const AppLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="content-wrapper">
        <Header />
        <main className="main-content">
          <Outlet /> {/* pages (Dashboard, Recipes, etc.) will render here */}
        </main>
      </div>
    </div>
  )
}

export default AppLayout