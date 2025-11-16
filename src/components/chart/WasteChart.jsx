import React, { useMemo } from 'react'
import { PieChart } from '@mui/x-charts'
import getExpiryStatus from '../../utils/dateUtils';
import Skeleton from '../common/Skeleton';
const COLORS = {
    safe: "#00C49F",
    expiring_soon: "#FFBB28",
    expired: "#FF8042",
};

const WasteChart = ({ items, loading }) => {
    const chartData = useMemo(() => {
        const expiryStatusCount = {
            'safe': 0,
            'expiring_soon': 0,
            'expired': 0
        }
        // Loop laga ke 
        items.forEach((item) => {
            const status = getExpiryStatus(item.expirationDate)
            if (status in expiryStatusCount) {
                expiryStatusCount[status]++
            }
        })
        return [
            {
                id: 1,
                label: 'Safe',
                value: expiryStatusCount.safe,
                color: COLORS.safe
            },
            {
                id: 2,
                label: 'Expiring Soon',
                value: expiryStatusCount.expiring_soon,
                color: COLORS.expiring_soon
            },
            {
                id: 3,
                label: 'Expired',
                value: expiryStatusCount.expired,
                color: COLORS.expired
            }
        ].filter(entry => entry.value > 0)
    }, [items])

    if (loading) {
        return <Skeleton height="300px" />
    }
    if (chartData.length === 0) {
        return (
            <div className="chart-container empty-chart">
                <h3>Pantry Status</h3>
                <p>No items in your pantry to display.</p>
            </div>
        )
    }
    return (
        <div className='chart-container'>
            <h3>Pantry Status (Potential Waste)</h3>
            <PieChart
                series={[
                    {
                        data: chartData,
                        innerRadius: 30,
                        outerRadius: 100,
                        cornerRadius:5,
                        paddingAngle:3
                    }
                ]}
                height={300}
                width={350}

                //Show legend
                slotProps={{
                    legend: {
                        hidden: false,        // show legend
                        position: "right",    // left | right | top | bottom
                        direction: "row",  // row or column
                    },
                }}
            />
        </div>
    )
}

export default WasteChart