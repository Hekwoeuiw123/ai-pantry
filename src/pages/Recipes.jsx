import React, { useEffect, useRef, useState } from 'react'
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

  // This ref will hold our AbortController 
  // ref me rakha kyuki ye persist karke rakhega current active controller ko 
  const abortControllerRef = useRef(null);

  // This useEffect runs ONCE when the component mounts
  // and returns a cleanup function
  useEffect(() => {
    // This is the cleanup function.
    // It will run when the user navigates away (component unmounts)
    return () => {
      // If refcontroller me hai active kuch to abort it 
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // ingredients that we r passing in recipe generate Compo 
  const handleGenerateButton = async (ingredients) => {
    if (abortControllerRef.current) {
      // new Request send se pehle old wala Abort kiya
      abortControllerRef.current.abort();
    }

    // creating New controller
    const controller = new AbortController()
    abortControllerRef.current = controller // Store it in the ref

    setLoading(true)
    setError(null);
    setRecipes([]);

    try {
      const newRecipes = await getRecipes(ingredients, controller.signal)
      const new_Recipes = newRecipes.replace(/```json|```/g, '');
      // console.log();
      if (newRecipes) {
        setRecipes(JSON.parse(new_Recipes))
      }
      else{
        // ye handle karega only when abort na hua ho cuz signal abort expected behaviour hai
      if (!controller.signal.aborted) {
        setError('Failed to get recipes. Please try again.');
      }
      }
    } catch (error) {
      // This will only catch errors not handled by the service
      if (!controller.signal.aborted) {
        setError('An unexpected error occurred.', error.message);
      }
    }
    finally {
      // Once the request is done (or aborted), clear the ref
      // Ensuring tht ref doesn't hold outdated controller
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setLoading(false);
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