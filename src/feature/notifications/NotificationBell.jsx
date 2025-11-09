import React, { useMemo } from 'react'
import { usePantry } from '../../context/pantryContext'
import getExpiryStatus from '../../utils/dateUtils'
import { FaBell } from "react-icons/fa"; 
import '../../styles/NotificationBell.css'
const NotificationBell = () => {
    const {item} = usePantry()
    
    
    const expiryCount = useMemo(()=>{
        // basically  , length de raha hai ki kitne item ye dono status me aate hai
        return item.filter(item => {
            const status = getExpiryStatus(item.expirationDate) 
            return status === 'expiring_soon' || status === 'expired'
        }).length
    },[item])
  return (
    <button className='notification-bell'>
        <FaBell size={24}/>
        { expiryCount > 0 && (<span className="notification-dot">{expiryCount}</span>) }
    </button>
  )
}

export default NotificationBell