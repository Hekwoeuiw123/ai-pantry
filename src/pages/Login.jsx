import React from 'react'
import LoginForm from '../feature/auth/LoginForm'
import { Link } from 'react-router-dom'
import GoogleSignInButton from '../feature/auth/GoogleSignInButton'

const Login = () => {
  return (
     <div className="auth-container">
      <h2>Welcome Back 👋</h2>
      <LoginForm />
      <div className="auth-separator">
        <span>OR</span>
      </div>
      <GoogleSignInButton />
      <p className="auth-switch">
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  )
}

export default Login