import React, { useState } from 'react'
import { signInWithEmail } from '../../hooks/useAuth'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'

import '../../styles/auth.css'
import { useAuthData } from '../../context/AuthContext';

const LoginForm = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const {currentUser}  = useAuthData()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            setError("")
            await signInWithEmail(email, password)
            toast.success("Welcome Back !! ",currentUser.displayName)
            navigate('/')
        } catch (error) {
            setError(error)
            toast.error("Error Occured !! ", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className='auth-form' onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            <label htmlFor="email">Email</label>
            <input
                type="email"
                placeholder='Enter Email Here...'
                value={email}
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                required />
            <label htmlFor="pass">Password</label>
            <input
                type="password"
                placeholder='Enter Password Here...'
                value={password}
                id="pass"
                onChange={(e) => setPassword(e.target.value)}
                required />
            <button type="submit" className="btn-primary">
                Login
            </button>
        </form>
    )
}

export default LoginForm