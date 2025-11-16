import React, { useMemo } from 'react'
import Skeleton from '../common/Skeleton';
import { PieChart } from '@mui/x-charts';

const CATEGORY_COLORS = {
    Fruit: "#FF6B6B",
    Vegetable: "#51CF66",
    Dairy: "#74C0FC",
    Meat: "#FF922B",
    Grains: "#FFD43B",
    Other: "#845EF7",
};
const CategoryChart = ({ items, loading }) => {
    const chartData = useMemo(() => {
        const categoryCounts = {};

        items.forEach((item) => {
            const category = item.category !== 'N/A' ? item.category : 'UnCategorize'
            categoryCounts[category] = (categoryCounts[category] || 0) + 1
        });

        return Object.entries(categoryCounts).map(([label, value], index) => {
            return {
                id: index,
                label,
                value,
                color: CATEGORY_COLORS[label]
            }
        })

    }, [items])

    if (loading) return <Skeleton height="300px" />

    if (chartData.length === 0) {
        return (
            <div className="chart-container empty-chart">
                <h3>Items by Category</h3>
                <p>No items in your pantry to display.</p>
            </div>
        );
    }
    return (
        <div className='chart-container'>
            <h3>Items by Category</h3>
            <PieChart
                series={[
                    {
                        data: chartData,
                        innerRadius: 30,
                        outerRadius: 120,
                        cornerRadius:5,
                        paddingAngle:3
                    }
                ]}
                width={500}
                height={300}
           
                // Show legend
                slotProps={{
                    legend: {
                        hidden: false,        // show legend
                        position: "right",    // left | right | top | bottom
                        direction: "column",  // row or column
                    },
                }}
            />
        </div>
    )
}

export default CategoryChart