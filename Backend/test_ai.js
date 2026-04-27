const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are an eco-friendly AI assistant for the Greenify app. A user has submitted a custom action: "Planted a tree"
Respond ONLY with valid JSON using exactly this structure, with no markdown formatting:
{ "category": "eco_friendly | neutral | harmful", "points": 10, "description": "1-2 line explanation", "message": "motivational line or warning", "suggestion": "better alternative if harmful (or empty string if not harmful)" }`;
    const result = await model.generateContent(prompt);
    console.log("gemini-2.5-flash:", result.response.text());
  } catch(e) { console.log("gemini-2.5-flash error:", e.message); }
}
run();
