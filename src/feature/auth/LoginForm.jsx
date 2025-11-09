import React, { useState } from 'react'
import { signInWithEmail } from '../../hooks/useAuth'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'

import '../../styles/auth.css'

const LoginForm = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            setError(null)
            const userCredential = await signInWithEmail(email, password)
            const user = userCredential.user;
            const displayName = user.displayName || user.email;
            toast.success("Welcome Back !! ",displayName)
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