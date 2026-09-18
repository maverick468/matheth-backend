// backend/services/quizService.js (or wherever your API endpoint / server code lives)
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateQuizFromPDF(fileText, questionCount, difficulty) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      // Updated to an active, supported model
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are an expert quiz generator. Analyze the provided text and generate multiple-choice questions. Return ONLY a valid JSON object containing a 'questions' array. Each question object must have: 'question', 'options' (array of 4 choices), 'correctAnswer', and 'explanation'."
        },
        {
          role: "user",
          content: `Generate exactly ${questionCount} questions with a difficulty level of '${difficulty}' based on the following text:\n\n${fileText}`
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(chatCompletion.choices[0].message.content);
  } catch (error) {
    console.error("Groq API Generation Error:", error);
    throw error;
  }
}