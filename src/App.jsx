import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import {ToastContainer} from 'react-toastify'
// import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* This <Outlet /> , 
        It will render  Login page, Register page, 
        or entire protected AppLayout based on the URL.
      */}
      <Outlet />

      {/* This is the perfect place for a global notification component
        that needs to live "outside" all other pages.
        <Toaster position="top-right" /> 
      */}
      <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
    </>
  )
}

export default App
