require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" }); 

app.post("/ask", async (req, res) => {
  const question = req.body.question;
  if (!question) return res.status(400).json({ error: "No question provided" });

  try {
    const prompt = `You are a calculator assistant. Answer the following math question with the numeric answer and one short sentence of explanation. Keep it under 40 words.\n\nQuestion: ${question}`;
    const result = await model.generateContent(prompt);
    const answer = result.response.text();
    res.json({ answer });
  } catch (err) {
    console.error("DETAILED ERROR:", err.message);
    res.status(500).json({ error: "AI request failed" });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));

// Export for Vercel with a 60-second timeout
module.exports = app;
module.exports.config = { maxDuration: 60 };
