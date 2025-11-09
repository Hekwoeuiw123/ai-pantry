import axios from 'axios'

// ViT ( Vision Transformer By Google) Modal hai that give result like waht is in img take img as input
// const HG_URL = 'https://api-inference.huggingface.co/models/google/vit-base-patch16-224-in21k'
const HG_URL='https://router.huggingface.co/hf-inference/models/google/vit-base-patch16-224'
// so netlify me u must have to export function handler
// netlify call it when ur frontend calls this function’s endpoint (like /api/analyzeImage).
// using fetch/axios

//event have HTTP request information (like body, headers, etc.).
export default async function handler(event) {
    // This is the Hugging Face API model we'll use for food recognition.


    // this is the imageURL that we paased in body when we r in aiService.js
    const { imageURL } = event.body

    if (!imageURL) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Image URL is required.' }),
        };
    }

    try {
        const response = await axios.post(
            HG_URL,
            { inputs: imageURL },
            {
                headers: {
                    'Authorization': `Bearer ${import.meta.env.HUGGING_FACE_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        )
        const predictions = response.data
        // result come with like this so to get 1 with high prob we do this
        //{ lable : "tomato , tomatoleaf" ,  score:0.045988 }
        const foodLabels = predictions
            .filter(pred => pred.score > 0.02 && !pred.label.includes('person'))
            .map(pred => pred.label.split(',')[0]);
        return {
            statusCode: 200,
            body: JSON.stringify({ ingredients: foodLabels.slice(0, 5) }), // Send top 5
        };

    } catch (error) {
        console.error('Error calling Hugging Face API:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to analyze image.' }),
        };
    }
}
