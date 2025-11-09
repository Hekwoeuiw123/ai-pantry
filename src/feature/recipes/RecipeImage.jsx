import React, { useEffect, useState } from 'react'
import { fetchImage } from '../../services/aiService'

const RecipeImage = ({ imagePrompt, title }) => {
    const [loading, setLoading] = useState(true)
    const [imageUrl, setImageUrl] = useState(null)

    useEffect(() => {
        async function loadImage() {
            setLoading(true)
            const url = await fetchImage(imagePrompt) // takes Query like search = tomato20% + potato20% 
            setImageUrl(url)
            setLoading(false)
        }
        loadImage()
    }, [imagePrompt])

    if (loading) {
        return <Skeleton height="200px" />;
    }
    return (
        <img src={url}
            alt={title}
            className="recipe-card-image"
            // Fallback in case the Pexels URL is broken
            onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = 'https://placehold.co/600x400/eeeeee/cccccc?text=Image+Error';
            }}
        />
    )
}

export default RecipeImage