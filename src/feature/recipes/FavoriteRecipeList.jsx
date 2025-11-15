import React, { useState } from 'react'
import { useFavorites } from '../../context/FavoritesContext'
import { InfinitySpin } from 'react-loader-spinner'
import RecipeCard from './RecipeCard'
import { removeFavoriteRecipe } from '../../services/favoritePantryService'
import { useAuthData } from '../../context/AuthContext'
import RecipeModal from './RecipeModal'
import { Modal } from '../../components/common/Modal'

const FavoriteRecipeList = () => {
    const { favorites, loading } = useFavorites()
    const { currentUser } = useAuthData()
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    return (
        <div className="favorites-section">
            <h3>My Favorite Recipes</h3>

            {loading && <InfinitySpin height="100" width="100" />}
            {selectedRecipe && (
                <Modal onClose={() => setSelectedRecipe(null)}>
                    <RecipeModal onClose={() => setSelectedRecipe(null)} recipe={selectedRecipe} />
                </Modal>
            )}

            {/* {!loading && favorites.length === 0 && (
                <p>You haven't saved any recipes yet. Go to the Recipes page and click the star!</p>
            )} */}

            <div className="recipe-grid">
                {
                    (!loading && favorites.length === 0)
                        ?
                        <p>You haven't saved any recipes yet. Go to the Recipes page and click the star!</p>
                        : favorites.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                isFavorited={true} // Pass this prop taki "filled" star aaye
                                // so abious hai ki star pe click kiya to remove hi hoga ,directly delete
                                onFavoriteClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm("Are You Sure to Remove it from Favorite")) {
                                        removeFavoriteRecipe(currentUser.uid, recipe.id)
                                    }
                                }}
                                onView={() => { setSelectedRecipe(recipe) }}
                            />
                        ))
                }
            </div>
        </div>
    )
}

export default FavoriteRecipeList