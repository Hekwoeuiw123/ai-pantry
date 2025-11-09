// src/utils/privateRoutes.js
import { Navigate, Outlet } from "react-router-dom";
import { useAuthData } from "../context/AuthContext";

export  const PrivateRoutes = () => {

  const { currentUser } = useAuthData();
   return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
  
};
