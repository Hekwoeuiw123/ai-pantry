import { differenceInDays, isFuture, isToday, parseISO } from 'date-fns'
import React, { useMemo } from 'react'
import Skeleton from '../common/Skeleton'
import { BarChart } from '@mui/x-charts'

const ExpiryTimeline = ({ items, loading }) => {
    const chartData = useMemo(() => {
        // it will give data that we have to show in Chart:-
        //         [
        //   {name: "Today", expiring: 0},
        //   {name: "+1 Day", expiring: 0},
        //   {name: "+2 Days", expiring: 0},
        //   ...
        //   {name: "+7 Days", expiring: 0}
        // ]
        const timeLines = Array(7).fill(null).map((_, index) => {
            return {
                name: index === 0 ? 'Today' : `+${index} Day${index > 1 ? 's' : ''}`,
                expiring: 0
            }
        })
        // getting Today days
        const today = new Date()
        // Loops so that ki 'expiring' ko update kr ske 
        items.forEach(item => {
            if (!item.expirationDate || item.expirationDate === 'N/A') return

            const expiryDate = parseISO(item.expirationDate) // convert '25-11-2025' in to new Date('25-11-2025') 

            // check karenge if today hai ya aage ke din hai then we can take analysis
            if (isToday(expiryDate) || isFuture(expiryDate)) {
                // ye return karega Days that are remaining to expire 
                let DaysUntil = differenceInDays(expiryDate, today)
                // suppose 2 days is left then it will goes in +2days expiring count
                // suppose 0 days means ye aaj expire hoga to isko we put in 0 index of timeLines joki Today hai 
                if (DaysUntil >= 0 && DaysUntil <= 7) {
                    timeLines[DaysUntil].expiring++
                }
            }
        });
        return timeLines;
    }, [items])

    if(loading) return <Skeleton height="300px"/>

    return (
        <div className='chart-container'>
            <h3>Expiry Timeline (Next 7 Days)</h3>
            <BarChart
              xAxis={[{
                data:chartData.map(d => d.name)// [Today ,+1Day ,...]
              }]}
              series={[{
                data : chartData.map(d => d.expiring) // [0 ,2 ,3 ,4..]
              }]}
              width={600}
              height={300}
            />
        </div>
    )
}

export default ExpiryTimeline