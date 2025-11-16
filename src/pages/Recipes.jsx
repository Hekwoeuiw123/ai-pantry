import React, { useEffect, useRef, useState } from 'react'
import RecipeCard from '../feature/recipes/RecipeCard'
import { fetchImage, getRecipes } from '../services/aiService'
import { useFavorites } from '../context/FavoritesContext'
import RecipeGenerator from '../feature/recipes/RecipeGenerator'
import RecipeModal from '../feature/recipes/RecipeModal'
import '../styles/Recipes.css'
import { addFavoriteRecipe, removeFavoriteRecipe } from '../services/favoritePantryService'
import { toast } from 'react-toastify'
import { useAuthData } from '../context/AuthContext'
import Skeleton from '../components/common/Skeleton'
import { Modal } from '../components/common/Modal'
import { db } from '../services/firebase'
import { doc, updateDoc } from 'firebase/firestore'
const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null);
  const { currentUser } = useAuthData()
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const { favoriteIdMap } = useFavorites()

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
      else {
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


  const handleFavoriteButton = async (e, recipe, isFavorited, favoriteId) => {
    e.stopPropagation(); // Stop it from triggering 'onView'

    if (!currentUser) return;

    if (isFavorited) {
      // It's already a favorite, so we remove it
      removeFavoriteRecipe(currentUser.uid, favoriteId).then(() => {
        toast.success("Removed From Favorite Recipe ")
      }).catch((err) => {
        console.error("Failed to Removed from Favorite", err)
        toast.error("Failed to remove favorite");
      })

    } else {
      // It's not a favorite, so we add it

      const tempData = await addFavoriteRecipe(currentUser.uid, { ...recipe, imageUrl: "https://placehold.co/600x400/eeeeee/cccccc?text=Image+Error" })
      if(!tempData){
        toast.error("Failed to Add Recipe in Favorite Recipe")
        return
      }
      toast.success("Added to Favorite Recipe ")
      // const imageUrl = await fetchImage(recipe.imagePrompt)
      // ye imgurl store kr rahe hai taki baar baar apne ko pexel call na krna pade 
      // jo ki ho raha tha in profile Favourite Recipe List 


      // so earlier we r fetching the image then adding that img in list but UI slow ho ja raha tha isse
      // now we first add the placeholderimgurl and backend me img ko update krdenge
      fetchImage(recipe.imagePrompt)
        .then(url => {
          updateDoc(doc(db, "users", currentUser.uid, "favorites", tempData.id), {
            imageUrl: url
          });
        })
        .catch(err => console.log("Image fetch failed:", err));
    }
  }

  return (
    <div className="page-container">
      <RecipeGenerator onGenerate={handleGenerateButton} loading={loading} />
      {/* We'll add the modal here later */}
      {selectedRecipe && (
        <Modal onClose={() => setSelectedRecipe(null)}>
          <RecipeModal onClose={() => setSelectedRecipe(null)} recipe={selectedRecipe} />
        </Modal>
      )}
      {error && <p className="auth-error">{error}</p>}

      {/* {loading && <InfinitySpin height="60" width="74" />} */}

      <div className="recipe-results-grid">
        {loading && (
          <><Skeleton height="400px" width="400px" /><Skeleton height="400px" width="400px" /><Skeleton height="400px" width="400px" /></>
        )}
        {!loading && recipes.length > 0 && (
          recipes.map((recipe, index) => {
            // chk karega generated recipes alredy favourite me hai kya if hua to 
            // simple star fill krke return karega
            const isFavorited = favoriteIdMap.has(recipe.title)
            const favoriteId = favoriteIdMap.get(recipe.title) // favorite.id hai ye 
            // console.log(isFavorited, favoriteId);

            return <RecipeCard
              recipe={recipe}
              key={index}
              isFavorited={isFavorited}
              onFavoriteClick={(e) => handleFavoriteButton(e, recipe, isFavorited, favoriteId)}
              onView={() => setSelectedRecipe(recipe)}
            />
          }))
        }
      </div>
    </div>
  )
}

export default Recipes