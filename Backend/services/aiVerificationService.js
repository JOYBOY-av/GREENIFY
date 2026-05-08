const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType
    },
  };
}

exports.verifySubmission = async (actionName, note, filePath, mimeType, extractedData) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  let prompt = `
You are the verification engine for the Greenify eco-action app.
The user claims to have performed this action: "${actionName}"
User's description: "${note || 'None provided'}"
`;

  if (extractedData.ocrText) {
    prompt += `\nText extracted from image via OCR: "${extractedData.ocrText}"\n`;
  }
  
  if (extractedData.exif && extractedData.exif.tags && extractedData.exif.tags.DateTimeOriginal) {
    const dateTaken = new Date(extractedData.exif.tags.DateTimeOriginal * 1000);
    prompt += `\nImage EXIF Date Taken: ${dateTaken.toISOString()}\n`;
  }

  prompt += `
Analyze the image and the provided metadata to verify the user's claim.
Answer the following:
1. Does the image visually support the claim "${actionName}" and the description?
2. Is the image a photo of a computer screen or monitor?
3. Does it look like a generic stock photo?
4. If OCR text is present, does it match the expected context (e.g., a transit ticket, receipt for a reusable bag)?

Based on your analysis, provide a confidence score from 0 to 100 on how likely this is a genuine, valid proof of the action.

Respond ONLY with valid JSON using exactly this structure, with no markdown formatting:
{
  "confidence_score": number,
  "is_screen_photo": boolean,
  "is_stock_photo": boolean,
  "explanation": "A 1-2 sentence explanation of your decision."
}
`;

  try {
    const parts = [prompt];
    if (filePath) {
      parts.push(fileToGenerativePart(filePath, mimeType));
    }

    const result = await model.generateContent(parts);
    const responseText = result.response.text();
    
    const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonString);

  } catch (err) {
    console.error('AI Verification Error:', err);
    throw new Error('AI Verification failed');
  }
};
