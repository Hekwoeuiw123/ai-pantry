const { createClient } = require('pexels');

// Initialize the Pexels client
const client = createClient(process.env.PEXELS_API_KEY);

exports.handler = async (event) => {
  // Get the search query from the URL (e.g., .../getRecipeImage?query=chicken)
  const { query } = event.queryStringParameters;


//   If there’s no search term, it immediately sends a 400 error.
//   This prevents unnecessary API calls.
  if (!query) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Search query is required.' }) };
  }

  try {
    const data = await client.photos.search({ query, per_page: 1, orientation: 'landscape' });

    if (!data.photos || data.photos.length === 0) {
      return { statusCode: 404, body: JSON.stringify({ error: 'No image found.' }) };
    }

    // get the URL of the first image found
    const imageUrl = data.photos[0].src.large; // ham yeha .large, .medium, .small, etc. aise bhi use kr skte hai

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: imageUrl }),
    };

  } catch (error) {
    console.error('Error calling Pexels API:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch image.' }) };
  }
};