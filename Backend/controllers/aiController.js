const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeAction = async (req, res) => {
  const { description } = req.body;

  if (!description || description.trim() === '') {
    return res.status(400).json({ error: 'Description is required' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API Key is missing in the backend' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an eco-friendly AI assistant for the Greenify app. A user has submitted a custom action: "${description}"

Analyze the action and classify it into one of these categories: "eco_friendly", "neutral", or "harmful".
1. "eco_friendly": Beneficial for the environment or society. Assign 10 to 30 points based on effort/impact (low effort ~10, medium ~15-20, high ~25-30). Provide a 1-2 line explanation.
2. "neutral": Not harmful but not distinctly eco-friendly. 0 points. Provide an encouraging line.
3. "harmful": Harmful to the environment/society. 0 points. Provide a warning and a better alternative.

Respond ONLY with valid JSON using exactly this structure, with no markdown formatting:
{
  "category": "eco_friendly | neutral | harmful",
  "points": number,
  "description": "1-2 line explanation",
  "message": "motivational line or warning",
  "suggestion": "better alternative if harmful (or empty string if not harmful)"
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    

    const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonResult = JSON.parse(jsonString);

    res.json(jsonResult);
  } catch (err) {
    console.error('AI Analysis Error:', err);
    res.status(500).json({ error: 'Failed to analyze action. Please try again.' });
  }
};
