import React, { useEffect, useState } from 'react'
import { fetchImage } from '../../services/aiService'
import Skeleton from '../../components/common/Skeleton'
const RecipeImage = ({ imagePrompt, title ,savedUrl  }) => {
    const [loading, setLoading] = useState(!savedUrl) // initially true tha ab savedurl nhi hoga to true hoga
    const [imageUrl, setImageUrl] = useState(savedUrl || null) // savedUrl hua to wahi lelena else 
                                                               // fetch karenge ham

    useEffect(() => {
        if(savedUrl) return
        async function loadImage() {
            setLoading(true)
            const url = await fetchImage(imagePrompt) // takes Query like search = tomato20% + potato20% 
            setImageUrl(url)
            setLoading(false)
        }
        loadImage()
    }, [imagePrompt,savedUrl])

    if (loading) {
        return <Skeleton height="200px" width="100%"/>;
    }
    return (
        <img src={imageUrl}
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