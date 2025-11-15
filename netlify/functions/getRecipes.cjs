// const dotenv = require("dotenv");
// dotenv.config();  // ✅ Load .env before anything else

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' }); // cheap hai to generate the text

// Prompt to get Result
const getRecipePrompt = (ingredients) => {
  const ingredientList = ingredients.join(', '); // apple,potato,tomato in string

  return `
    You are a helpful and friendly kitchen assistant called "AI Pantry."
    Your job is to generate 3 complete, unique recipe ideas using the ingredients provided by the user.

    The user provides ingredients in this format: "tomatoes, chicken, onion".
    The user has: ${ingredientList}

    ### INSTRUCTIONS:
    1. Prioritize recipes that creatively use the listed ingredients.
    2. Do NOT include ingredients that are not listed. Avoid adding staples like salt, oil, water, or spices unless they appear in the user's list.
    3. Each recipe must:
       - Have a friendly, home-style tone.
       - Include all steps necessary to cook the dish clearly and sequentially.
       - Provide approximate nutritional values.
       - Include an “imagePrompt” field with a clear, descriptive phrase that can be used to search Pexels for a matching image (avoid people in the prompt).
    4. Respond ONLY with a valid JSON array of exactly 3 recipe objects.
    5. Do not include any text, explanations, or formatting before or after the JSON.

    ### JSON OUTPUT FORMAT:
    [
      {
        "title": "Recipe Title",
        "description": "A short, friendly, one-sentence description of the dish.",
        "prepTime": "Time in minutes",
        "nutrition": {
          "calories": "Number",
          "protein": "Grams",
          "carbs": "Grams",
          "fat": "Grams"
        },
        "ingredients": [
          {"item": "Ingredient Name", "quantity": "Amount"}
        ],
        "instructions": [
          "Step 1...",
          "Step 2...",
          "Step 3..."
        ],
        "imagePrompt": "A realistic photo of [dish name], home-style presentation on a kitchen table, well-lit, no people."
      }
    ]
  `;
};

exports.handler = async (event) =>{
     try {
      
        const {ingredients} = JSON.parse(event.body)
        if(ingredients.length === 0 || !ingredients){
            return {
                statusCode:400,
                body:JSON.stringify({error:'Ingredients Not Fount ,Ingredients are required.' })
            }
        }

        const result = await model.generateContent(getRecipePrompt(ingredients))
       
        
        const response = result.response
        const JsonText = response.text() // dont need to stringify cuz already in string

        return {
            statusCode :200,
            headers:{'Content-Type': 'application/json' },
            body:JsonText
        }
     } catch (error) {
         console.error('Error calling Google Gemini API:', error);
        return {
           statusCode: 500, body: JSON.stringify({ error: 'Failed to generate recipes.' })
        }
     }
}