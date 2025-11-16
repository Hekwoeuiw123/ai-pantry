import React from 'react'
import { usePantry } from '../../context/pantryContext'
import CategoryChart from '../../components/chart/CategoryChart'
import ExpiryTimeline from '../../components/chart/ExpiryTimeline'
import WasteChart from '../../components/chart/WasteChart'
import getExpiryStatus from '../../utils/dateUtils'

const AnalyticsDashboard = () => {
    const {item:items , loading} = usePantry()
    const item_Total = items.length
    const item_Expired_Count = items.filter(item => getExpiryStatus(item.expirationDate) === 'expired').length
    const item_Safe = items.filter(item => getExpiryStatus(item.expirationDate) === 'safe').length
    const item_Expiring_Soon_Count = items.filter(item => getExpiryStatus(item.expirationDate) === 'expiring_soon').length
  return (
    <div className='analytics-dashboard'>
        <div className="stats-grid">
            <div className="stats-card">
                <h4>Total Items</h4>
                <h1>{loading ? '...' : item_Total}</h1>
            </div>
            <div className="stats-card safe">
                <h4>Items Safe</h4>
                <h1>{loading ? '...' : item_Safe}</h1>
            </div>
            <div className="stats-card expiring">
                <h4>Items Expiring Soon</h4>
                <h1>{loading ? '...' : item_Expiring_Soon_Count}</h1>
            </div>
            <div className="stats-card expired">
                <h4>Items Expired</h4>
                <h1>{loading ? '...' : item_Expired_Count}</h1>
            </div>
        </div>
        <div className="charts-grid">
            <CategoryChart items ={items} loading={loading}/>
            <WasteChart items ={items} loading={loading}/>
        </div>
        <div className="chart-grid">
            <ExpiryTimeline items ={items} loading={loading}/>
        </div>
    </div>
  )
}

export default AnalyticsDashboard