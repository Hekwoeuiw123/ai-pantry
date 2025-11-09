import React, { useState } from 'react'
import { signInWithGoogle } from '../../hooks/useAuth'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
const GoogleSignInButton = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const handleGoogleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true)
      setError("")
      await signInWithGoogle();
      toast.success("LoggedIn Successfully 🎉")
      navigate('/')
    } catch (error) {
      setError("Got Error in SignIn with google")
      console.log(error);
      toast.error("Google Sign-In failed:", error);
    }
    finally{
       setLoading(false)
    }
  }

  return (
    <button className="btn-google" onClick={handleGoogleLogin}>
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        style={{ width: 20, marginRight: 8 }}
      />
      Sign in with Google
    </button>
  )
}

export default GoogleSignInButton