import React from 'react'
import { usePantry } from '../../context/pantryContext'
import { InfinitySpin } from 'react-loader-spinner'
const RecipeGenerator = ({ onGenerate, loading }) => {
    const { item: pantryItems, loading: pantryLoading } = usePantry()
    const handleGenerate = () => {
        const ingredientsName = pantryItems.map(item => item.name)
        onGenerate(ingredientsName)
    }
    if (pantryLoading) {
        return <p>Loading pantry...</p>;
    }

    return (
        <div className="recipe-generator">
            <p>You have {pantryItems.length} items in your pantry.</p>
            <button onClick={handleGenerate} disabled={loading} className="btn-primary">
                {loading ? <InfinitySpin height="14" width="14" /> : 'Generate Recipe Ideas'}
            </button>
        </div>
    )
}

export default RecipeGenerator