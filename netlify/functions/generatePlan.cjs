const { GoogleGenerativeAI } = require('@google/generative-ai');;

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

// This prompt asks for a 7-day plan
const getPlannerPrompt = (ingredients) => {
    const ingredientList = ingredients.join(', ');

    return `
     You are a helpful and friendly weekly meal planner called "AI Pantry."
    Your task is to create a simple 7-day meal plan (Lunch and Dinner only) based on the ingredients the user has.

    The user provides ingredients in this format: "chicken, rice, onion, tomato".

    ### INSTRUCTIONS:
    1. Prioritize using the user's listed ingredients.
    2. You may assume access to basic staples (like salt, oil, and water).
    3. Keep meals simple and home-style — use friendly names like “Grilled Chicken Bowl” or “Tomato Rice”.
    4. You may repeat meals or include “Leftovers” if it makes sense.
    5. Each meal entry should include:
       - A short name or idea for the meal.
       - Optional metadata: estimated prep time and nutrition details (calories, protein, carbs, fat) if relevant.
    6. Respond ONLY with a valid JSON object.
    7. Do not include any text, code formatting, or backticks before or after the JSON.

    ### JSON OUTPUT FORMAT:
    {
      "Monday": {
        "lunch": {
          "meal": "Meal Idea 1",
          "prepTime": "Time in minutes",
          "nutrition": { "calories": "Number", "protein": "Grams", "carbs": "Grams", "fat": "Grams" }
        },
        "dinner": {
          "meal": "Meal Idea 2",
          "prepTime": "Time in minutes",
          "nutrition": { "calories": "Number", "protein": "Grams", "carbs": "Grams", "fat": "Grams" }
        }
      },
      "Tuesday": {
        "lunch": { "meal": "Meal Idea 3", "prepTime": "Time in minutes" },
        "dinner": { "meal": "Meal Idea 4", "prepTime": "Time in minutes" }
      }
      // ... and so on for all 7 days ...
    }

    ### USER INPUT:
    The user has: ${ingredientList}
  `;
};

// The main Netlify function handler
exports.handler = async (event) => {
    try {
        const { ingredients } = JSON.parse(event.body);
        if (!ingredients || ingredients.length === 0) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Ingredients Not Fount ,Ingredients are required.' }) };
        }

        // Generate the content
        const result = await model.generateContent(getPlannerPrompt(ingredients));
        const response = await result.response;
        const jsonText = response.text();

        // Send the raw JSON string back to the frontend
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: jsonText,
        };

    } catch (error) {
        console.error('Error calling Google Gemini API:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to generate meal plan.' }) };
    }
};