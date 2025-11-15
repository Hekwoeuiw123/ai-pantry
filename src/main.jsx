import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/styles/index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
// import {ToastContainer} from 'react-toastify'

import { PrivateRoutes } from '../src/utils/privateRoutes.jsx';
import AppLayout from '../src/components/layout/AppLayout.jsx';

import Register from '../src/pages/Register.jsx'
import Login from '../src/pages/Login.jsx'
import Dashboard from '../src/pages/Dashboard.jsx';
import Recipes from '../src/pages/Recipes.jsx';
import Planner from '../src/pages/Planner.jsx';
import Analytics from '../src/pages/Analytics.jsx';
import Profile from '../src/pages/Profile.jsx';
import NotFound from '../src/pages/NotFound.jsx';
import { PantryProvider } from './context/pantryContext.jsx'
import { FavoriteProvider } from './context/FavoritesContext.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        {/* --- Public Routes --- */}

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- Protected Routes --- */}

        {/* We wrap all our protected pages in two layouts:
        1. <PrivateRoutes />: This checks if the user is logged in.
           chk krega if user is logged in if yes then redirect to AppLayout
           If not, it redirects to /login. If they are, it renders its child (<AppLayout />).
        2. <AppLayout />: This renders the Sidebar and Header, and then
           renders its own child page (e.g., <Dashboard />) inside its <Outlet />.
      */}
        <Route element={<PrivateRoutes />}>
          <Route element={<AppLayout />}>
            <Route path="/" index element={<Dashboard />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* --- 404 Not Found Route --- */}
        {/* --- if user ne koi dusra url me route dala to ye aayega page --- */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </>
  )
)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <PantryProvider>
        <FavoriteProvider>
          <RouterProvider router={router} />
        </FavoriteProvider>
      </PantryProvider>
    </AuthProvider>
  </StrictMode>,
)
