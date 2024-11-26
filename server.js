// Import required modules
import { OpenAI } from "openai"; // Use the ES6 import for OpenAI
import dotenv from "dotenv"; // Import dotenv to handle environment variables
import express from "express"; // Import express for server setup
import bodyParser from "body-parser"; // Import body-parser to parse incoming request bodies
import cors from "cors"; // Import cors for handling cross-origin requests

// Load environment variables from the .env file
dotenv.config();

// Initialize OpenAI with your API key from the .env file
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create an Express application
const app = express();
const port = 3000;

// Middleware setup
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Define an endpoint for your chat
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    // Use OpenAI to generate a response
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Specify the model to use
      messages: [{ role: "user", content: userMessage }],
    });

    // Send the response back to the client
    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    // Handle any errors from OpenAI API
    console.error("Error with OpenAI API:", error.message);
    res.status(500).json({ error: "An error occurred while communicating with OpenAI." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
