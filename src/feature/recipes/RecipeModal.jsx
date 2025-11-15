import React, { useMemo, useState } from 'react'
import { usePantry } from '../../context/pantryContext'
import { useAuthData } from '../../context/AuthContext'
import { InfinitySpin } from 'react-loader-spinner'
import { updatePantryAfterCooking } from '../../services/pantryService'
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import '../../styles/RecipeModal.css'
import { toast } from 'react-toastify'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../services/firebase'
const RecipeModal = ({ recipe, onClose }) => {
    const { title, description, prepTime, nutrition, ingredients, instructions } = recipe
    const { isCooked } = recipe
    const [loading, setLoading] = useState(false)
    const { item: pantryItems } = usePantry()
    const { currentUser } = useAuthData()
    const [isDone, setIsDone] = useState(false)

    // We use useMemo to calculate missing items only when the modal opens
    // or when the pantry/recipe changes.
    const { missingIngredients, canCook } = useMemo(() => {
        const missing = []

        // Create a "map" of the pantry for fast lookups
        // We convert "Chicken Breast" to "chicken breast"
        const pantryMap = new Map(
            pantryItems.map((pantryItem) => [pantryItem.name.toLowerCase(), pantryItem.quantity])
        )

        for (const recipeIng of ingredients) {
            // Clean the recipe item: "Chicken Breast (diced)" -> "chicken breast"
            const cleanedIngredientName = recipeIng.item.toLowerCase().split('(')[0].trim()

            // Find a match in the pantry Fuzzy search
            const pantryKey = Array.from(pantryMap.keys()).find(key => key.includes(cleanedIngredientName))

            const pantryQuantity = pantryKey ? pantryMap.get(pantryKey) : 0

            // Check if the item is missing or quantity is zero
            if (pantryQuantity <= 0) {
                missing.push(recipeIng.item)
            }
        }

        return {
            missingIngredients: missing,
            canCook: missing.length === 0
        }
    }, [pantryItems, ingredients])


    const handleMarkAsCooked = async () => {
        if (!currentUser || !pantryItems) return;
        setLoading(true)
        setIsDone(false)
        try {
            await updatePantryAfterCooking(currentUser.uid, pantryItems, ingredients)
            await updateDoc(
                doc(db, "users", currentUser.uid, "favorites", recipe.id),
                { isCooked: true }
            );
            setIsDone(true)
            setTimeout(() => {
                onClose() // success hone baad bnd ho jayega 
                toast.success("Pantry Updated Successfully")
            }, 500)

        } catch (error) {
            console.error("Failed to mark as cooked:", error);
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='recipe-modal-content'>
            <h2 className='recipe-modal-title'>{title}</h2>
            <p className="recipe-modal-desc">{description}</p>
            <span className="recipe-modal-time">Prep Time: ~{prepTime} min</span>

            <div className="recipe-modal-availability">
                {canCook ? (
                    <h4 className="can-cook">
                        <FaCheckCircle /> You have all the ingredients!
                    </h4>
                ) : (
                    <>
                        <h4 className="missing-items">
                            <FaExclamationCircle /> You are missing ingredients:
                        </h4>
                        <ul className="recipe-modal-list missing-list">
                            {missingIngredients.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </>
                )}
            </div>

            <div className="recipe-modal-columns">
                <div className="recipe-modal-column">
                    <h4>Ingredients</h4>
                    <ul className="recipe-modal-list">
                        {
                            ingredients.map((ingr, index) => {
                                return <li key={index}>{ingr.quantity} {ingr.item}</li>
                            })
                        }
                    </ul>
                    <h4>Nutrition (approx.)</h4>
                    <ul className="recipe-modal-list">
                        <li>Calories: {nutrition.calories} kcal</li>
                        <li>Protein: {nutrition.protein}g</li>
                        <li>Carbs: {nutrition.carbs}g</li>
                        <li>Fat: {nutrition.fat}g</li>
                    </ul>
                </div>
                <div className="recipe-modal-column">
                    <h4>Instructions</h4>
                    <ol className='recipe-modal-step'>
                        {
                            instructions.map((step, index) => {
                                return <li key={index}>{step}</li>
                            })
                        }
                    </ol>
                </div>
            </div>
            <div className="recipe-modal-footer">
                <button
                    className={`button ${isDone ? 'button-success' : ''}`}
                    onClick={handleMarkAsCooked}
                    disabled={isCooked ||isDone || loading || !canCook}
                    title={!canCook ? "You are missing items" : "Mark as Cooked"}
                >
                    {loading ? <InfinitySpin height="70" width="100" /> : isCooked ? (
                        "Already Cooked"
                    ) : isDone ? (
                        "Pantry Updated"
                    ) : (
                        "Mark As Done"
                    )}
                </button>
            </div>
        </div>
    )
}

export default RecipeModal