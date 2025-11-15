import React from 'react'

const MealPlanner = ({ plan }) => {
    const days = Object.keys(plan)
    return (
        <div className='meal-plan-grid'>
            {
                days.map((day) => {
                    const { lunch, dinner } = plan[day]
                    return <div key={day} className="meal-plan-day">
                        <h3 className="meal-plan-day-title">{day}</h3>
                        <div className="meal-plan-meal">
                            <strong>Lunch</strong>
                            <p>{lunch.meal}</p>
                            <span>~{lunch.prepTime} mins</span>
                        </div>
                        <div className="meal-plan-meal">
                            <strong>Dinner</strong>
                            <p>{dinner.meal}</p>
                            <span>~{dinner.prepTime} mins</span>
                        </div>
                    </div>
                })
            }
        </div>
    )
}

export default MealPlanner