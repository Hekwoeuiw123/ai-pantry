import React, { useState } from 'react'
import profile from '../../assets/icons/profile.png'
import analytics from '../../assets/icons/analytics.png'
import pantry from '../../assets/icons/pantry.png'
import recipess from '../../assets/icons/recipess.png'
import planner from '../../assets/icons/planner.png'
import hamburger from '../../assets/icons/hamburger.png'
import setting from '../../assets/icons/setting.png'
import { NavLink } from 'react-router-dom'


const Sidebar = ({isOpen, onToggleSidebar}) => {

    // const [isOpen, setIsOpen] = useState(true)
    // const toggleSidebar = () => setIsOpen(!isOpen)

    // Component to show icon with their text whole thing inside <NavLink>
    const SidebarLink = ({ to, icon, text }) => {
        return <NavLink to={to} className="nav-link">
            <img src={icon} title={text} alt={text} className="nav-icon" />
            <span className='nav-text'>{text}</span>
        </NavLink>
    }
    return (
        <nav className={`sidebar ${!isOpen ? 'collapse-sidebar' : ''}`}>
            <div className="sidebar-header">
                <button onClick={onToggleSidebar} className="collapse-btn">
                    <img src={hamburger} alt="Collapse" />
                </button>
                <span className='pantry-logo' >AI Pantry</span>
            </div>
            <div className="sidebar-navlinks">
                <SidebarLink to="/" icon={pantry} text="Dashboard" />
                <SidebarLink to="/recipes" icon={recipess} text="Recipes" />
                <SidebarLink to="/planner" icon={planner} text="Planner" />
                <SidebarLink to="/analytics" icon={analytics} text="Analytics" />
            </div>
            <div className="sidebar-footer">
                <SidebarLink to="/profile" icon={profile} text="Profile" />
                <SidebarLink to="/profile" icon={setting} text="Setting" />
            </div>
        </nav>
    )
}

export default Sidebar