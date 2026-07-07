const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// ===============================
// Gemini Configuration
// ===============================

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// ===============================
// Home Route
// ===============================

app.get("/", (req, res) => {
    res.send("✅ Daily Brief AI Server is running...");
});

app.post("/test", (req, res) => {
    res.json({
        message: "POST route is working!"
    });
});
// ===============================
// AI Summary Route
// ===============================

app.post("/api/summary", async (req, res) => {

    try {

        const { title, description } = req.body;
        console.log("Received article:", title);

        const prompt = `
You are an AI News Assistant.

Read the article below and respond ONLY in this format.

What happened:
...

Background:
...

Latest Update:
...

Why it matters:
...

Keep each section under 60 words.
Use simple English.
Do not invent facts.
If information is missing, write "Not mentioned in the article."

Title:
${title}

Description:
${description}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        console.log("Gemini response:", response.text);

        res.json({
            summary: response.text,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to generate AI summary.",
        });

    }

});

// ===============================
// Start Server
// ===============================

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});