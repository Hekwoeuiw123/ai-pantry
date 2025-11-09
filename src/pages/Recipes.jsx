import React, { useState } from 'react'
import RecipeCard from '../feature/recipes/RecipeCard'
import { getRecipes } from '../services/aiService'
import RecipeImage from '../feature/recipes/RecipeImage'
import RecipeGenerator from '../feature/recipes/RecipeGenerator'
import { InfinitySpin } from 'react-loader-spinner'
import '../styles/Recipes.css'
const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null);
  // const [selectedRecipe, setSelectedRecipe] = useState(null);

  // ingredients that we r passing in recipe generate Compo 
  const handleGenerateButton = async (ingredients) => {
    try {
      setLoading(true)
      setError('');
      setRecipes([]);
      const newRecipes = await getRecipes(ingredients)
      setRecipes(newRecipes)
      setLoading(false)
    } catch (error) {
      setError(error.message);
      setLoading(false)
    }
  }
  return (
    <div className="page-container">
      <RecipeGenerator onGenerate={handleGenerateButton} loading={loading} />
      {/* We'll add the modal here later */}
      {/* {selectedRecipe && (
            <Modal onClose={() => setSelectedRecipe(null)}>
              <RecipeModal recipe={selectedRecipe} />
            </Modal>
          )} */}
      {error && <p className="auth-error">{error}</p>}

      {loading && <InfinitySpin height="24" width="24" />}

      <div className="recipe-results-grid">
        {
          recipes.map((recipe, index) => {
            return <RecipeCard
              recipe={recipe}
              key={index}
            // onViewClick={() => setSelectedRecipe(recipe)}
            />
          })
        }
      </div>
    </div>
  )
}

export default Recipes