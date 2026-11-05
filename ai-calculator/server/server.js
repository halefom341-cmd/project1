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
    const prompt = `You are a highly intelligent scientific AI assistant. 
    Rules for your answers:
    1. Keep answers concise (under 60 words).
    2. If the user asks a True/False question, start your answer with "True:" or "False:".
    3. If the user asks multiple questions at once, use a numbered list (1., 2., etc.) to answer each one clearly.
    4. If a question is a trick question or lacks a correct option (e.g., "What is 2+2? A) 3 B) 5"), detect this, point out the flaw, and provide the exact correct answer yourself.
    
    Question: ${question}`;
    
    const result = await model.generateContent(prompt);
    const answer = result.response.text();
    res.json({ answer });
  } catch (err) {
    console.error("DETAILED ERROR:", err.message);
    res.status(500).json({ error: "AI request failed" });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
module.exports = app;
module.exports.config = { maxDuration: 60 };
