import React from 'react'
import {AuthProvider, useAuthData} from '../context/AuthContext'
import {useNavigate} from 'react-router-dom'
import FavoriteRecipeList from '../feature/recipes/FavoriteRecipeList'
import '../styles/Profile.css'
const Profile = () => {
const {signOutUser ,currentUser} =  useAuthData()
const navigate = useNavigate()
const handleSignOut = async() => {
        try {
          await signOutUser()
          navigate("/login")
        } catch (error) {
          console.error("Failed to Log Out" , error)
        }
}
  return (
    <div className="page-container">
      <div className="profile-header">
        <h2>My Profile</h2>
        <button onClick={handleSignOut} className="btn-secondary">Log Out</button>
      </div>

      <div className="profile-details">
        <strong>Email:</strong> {currentUser?.email}
        {/* You can add more profile details here */}
      </div>

      <hr className="profile-divider" />
      <FavoriteRecipeList />
    </div>
  )
}

export default Profile