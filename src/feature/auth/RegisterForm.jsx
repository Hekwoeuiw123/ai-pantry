import React, { useState } from 'react'
import { signUpWithEmail } from '../../hooks/useAuth'
import { useNavigate } from "react-router-dom";

import { toast } from 'react-toastify'
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')

  // Password visibility toggle
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [showPass, setShowPass] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Logic to check the password thet it meets the criteria or not that was written in error
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Its Check if password fields match
    if (password !== confirmPass) {
      toast.error("Passwords do not match!");
      return;
    }

    // Its Check password strength
    if (!validatePassword(password)) {
      toast.error(
        "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      setLoading(true)
      setError(null)
      await signUpWithEmail(email, password)
      toast.success("Registered Successfully 🎉")
      navigate('/')
    } catch (error) {
      setError(error)
      toast.error("Error Occured !! ", error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className='auth-form' onSubmit={handleSubmit}>
      {error && <p className="error">{error.message}</p>}

      <label htmlFor="email">Email</label>
      <input
        type="email"
        placeholder='Enter Email Here...'
        value={email}
        id="email"
        onChange={(e) => setEmail(e.target.value)}
        required />

      <label htmlFor="pass">Password</label>
      <div className="password-input">
        <input
          type={showPass ? "text" : "password"}
          id='pass'
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          className="eye-btn"
          onClick={() => setShowPass(!showPass)}
        >
          {showPass ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      <label htmlFor="c_pass">Confirm Password</label>
      <div className="password-input">
        <input
          type={showConfirmPass? "text" : "password"}
          placeholder="Re-enter password"
          id='c_pass'
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          required
        />
        <button
          type="button"
          className="eye-btn"
          onClick={() => setShowConfirmPass(!showConfirmPass)}
        >
          {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      <button type="submit">Register</button>
    </form>
  )
}

export default RegisterForm