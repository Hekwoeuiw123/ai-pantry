import React, { useState } from 'react'
import RecipeImage from './RecipeImage'
import { FaStar, FaRegStar } from 'react-icons/fa';

const RecipeCard = ({ recipe, onView, isFavorited, onFavoriteClick}) => {
    const { title, description, prepTime, nutrition, imagePrompt } = recipe
   
    return (
        <div className='recipe-card' onClick={() => onView()}>
            <RecipeImage imagePrompt={imagePrompt} savedUrl={recipe.imageUrl} title={title} />
            <button className="favorite-btn" onClick={onFavoriteClick}>
                {
                      isFavorited ? <FaStar color="#FFBB28" size={30} /> : <FaRegStar size={30}/>
                }
            </button>
            <div className="recipe-card-content">
                <span className="recipe-card-time">{prepTime} mins</span>
                <h3 className="recipe-card-title">{title}</h3>
                <p className="recipe-card-desc">{description}</p>
                <div className="recipe-card-footer">
                    <span className="recipe-card-nutrition">
                        {nutrition.calories} kcal
                    </span>
                    {/* We will wire this button up in Day 4 */}
                    <button onClick={(e) =>{ e.stopPropagation(); onView()}} className="button button-small">
                        View Recipe
                    </button>
                </div>
            </div>
        </div>

    )
}

export default RecipeCard