import React from 'react'
import RecipeImage from './RecipeImage'
const RecipeCard = ({ recipe, onView }) => {
    const { title, description, prepTime, nutrition, imagePrompt } = recipe
    return (
        <div className='recipe-card'>
            <RecipeImage imagePrompt={imagePrompt} title={title} />
            <div className="recipe-card-content">
                <span className="recipe-card-time">{prepTime} mins</span>
                <h3 className="recipe-card-title">{title}</h3>
                <p className="recipe-card-desc">{description}</p>
                <div className="recipe-card-footer">
                    <span className="recipe-card-nutrition">
                        {nutrition.calories} kcal
                    </span>
                    {/* We will wire this button up in Day 4 */}
                    <button onClick={() => onView(recipe)} className="button button-small">
                        View Recipe
                    </button>
                </div>
            </div>
        </div>

    )
}

export default RecipeCard