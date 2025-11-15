import axios from "axios";

// Take the img Url that is genereted from Cloudnary and run the analyzeImg in backend 
export async function analyzeImage(imageURL) {
  try {
    const response = await axios.post(
      '/.netlify/functions/analyzeImage',
      {
        imageURL: imageURL,
      }
    )
    // return ingredients like ["apple","potato"]
    // jo humne analyze me se body body: JSON.stringify({ ingredients: foodLabels.slice(0, 5) })
    // so yehi ingredients ye de raha hai
    return response.data.ingredients
  } catch (error) {
    console.error('Error calling our AI service:', error);
    throw new Error('Failed to get ingredients from image.');
  }
}


export const getRecipes = async (ingredients, signal) => {
  try {
    const res = await axios.post('/.netlify/functions/getRecipes', {
      ingredients: ingredients,
    }, { signal });

    // The body of the response is already the JSON array
    return res.data;

  } catch (error) {
    if (axios.isCancel(error) || error.name === 'CanceledError') {
      // console.log('Request was cancelled');
      return null;  // So frontend knows not to show an error
    }
    console.error('Error calling getRecipes service:', error);
    throw new Error('Failed to get recipes.');
  }
}


export const getMealPlan = async (ingredients, signal) => {
  try {
    const res = await axios.post('/.netlify/functions/generatePlan', {
      ingredients: ingredients,
    },{signal});
    return res.data; // This will be the { Monday: ... } object
  } catch (error) {
    if (axios.isCancel(error) || error.name === 'CanceledError') {
      // console.log('Request was cancelled');
      return null;
    }
    console.error('Error calling getMealPlan service:', error);
    throw new Error('Failed to generate meal plan.');
  }
};

export const fetchImage = async (query) => {
  try {
    // We send the query as a URL parameter query apna 3 recipe name hoga
    const res = await axios.get(`/.netlify/functions/getRecipeImage?query=${encodeURIComponent(query)}`);
    // res.data will be { imageUrl: '...' }
    return res.data.imageUrl;
  } catch (err) {
    console.error('Error fetching Pexels image:', err);
    // Return a placeholder so the UI doesn't break
    return 'https://placehold.co/600x400/eeeeee/cccccc?text=Image+Not+Found';
  }
};

// Normally, if you want to call Hugging Face API directly from your React app,
// you would need to expose your Hugging Face API key in the frontend.
// That’s insecure because anyone could see your key in browser developer tools.

// and if .env me bhi dala to wo bs github pe nhi dikhega bundle hone ke time pe
// process.env.HUGGINGFACE_API_KEY. iski jgh pura API likh ke aajyega

// So instead, we create a Netlify Function (which runs on the server).
// That function safely stores your Hugging Face API key in process.env.HUGGINGFACE_API_KEY.