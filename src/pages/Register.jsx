import React from 'react'
import RegisterForm from '../feature/auth/RegisterForm'
import { Link } from 'react-router-dom'

const Register = () => {
  return (
     <div className="auth-container">
      <h2>Create Your Account 🥗</h2>
      <RegisterForm />
      <p className="auth-switch">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  )
}

export default Register