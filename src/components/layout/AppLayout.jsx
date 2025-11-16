import React, { useState } from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import '../../styles/applayout.css'
import '../../styles/sidebar.css'
import '../../styles/header.css'
const AppLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggleSidebar = () => {
    setIsOpen(prev => !prev);
  };
  return (
    <div className="app-layout">
      <Sidebar isOpen={isOpen} onToggleSidebar={handleToggleSidebar} />
      <div className="content-wrapper">
        <Header onToggleSidebar={handleToggleSidebar} />
        <main className="main-content">
          <Outlet /> {/* pages (Dashboard, Recipes, etc.) will render here */}
        </main>
      </div>
    </div>
  )
}

export default AppLayout