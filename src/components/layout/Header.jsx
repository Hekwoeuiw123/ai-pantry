import React from 'react'
import { useAuthData } from '../../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOutUser } from '../../hooks/useAuth'
import { toast } from 'react-toastify';
import logout from '../../assets/icons/logout.png'
import NotificationBell from '../../feature/notifications/NotificationBell';
const Header = ({onToggleSidebar}) => {
  const { currentUser } = useAuthData();
  const navigate = useNavigate()
  const location = useLocation()

  const UserProfile = () => {
    // if (!currentUser) return null
    if (currentUser === undefined) return null; // 
    if (!currentUser) {
      return <div className="profile-initials">U</div>;
    }
    const getInitials = (name) => {
      if (!name) return "U"
      let letters = name.split(" ").map((el) => el[0]).join("").toUpperCase()
      return letters
    }
    return (
      <Link to='/profile' className='user-avtar'>
        {
          currentUser?.photoURL ?
            <img src={currentUser.photoURL} alt="Profile" /> :
            <div className="profile-initials">
              {getInitials(currentUser.displayName)}
            </div>
        }
      </Link>
    )
  }
  const handleLogout = async () => {
    try {
      if (confirm("Are you Sure to Logout ?")) {
        await signOutUser();
        toast.success("User Logged Out !!")
        navigate('/login');
      } else {
        toast.info("User Cancel LoggingOut !!")
      }
    } catch (err) {
      console.error('Failed to log out', err);
    }
  }
  // this is for dynamic page title that we will get using useLocation hook
  const page_title = {
    "/": "Dashboard",
    "/recipes": "Recipes",
    "/planner": "Planner",
    "/profile": "Profile",
    "/analytics": "Analytics",
  }
  return (
    <div className='header' >
      <div className="header-left">
        <button
          onClick={onToggleSidebar}
          className="hamburger-btn"
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="page-title">{page_title[location.pathname]}</div>
      </div>
      <div className="header-controls">
        <NotificationBell />
        <UserProfile />
        <button onClick={handleLogout} className="logout-button-simple">
          <img src={logout} alt="Logout" className="nav-icon" />
        </button>
      </div>
    </div>
  )
}

export default Header