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
      const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo", // Specify the model
          messages: [
              {
                  role: "system",
                  content: `You are an assistant for a platform called EO!, designed to connect users with solution providers instantly. Your role is to act like a helpful assistant or salesman, guiding users through their requests to create clear, actionable details for solution providers. You aim to minimize back-and-forth communication, saving time for both users and providers.

                  When interacting:
                  1. Engage the user by asking targeted, relevant questions to understand their needs.
                  2. Proactively suggest additional details the user might not have considered, ensuring the request is comprehensive.
                  3. Confirm all key aspects of the request, including:
                     - User's name and location (if applicable)
                     - Specific needs or preferences
                     - Budget constraints
                     - Deadlines or timelines
                     - Additional relevant details (e.g., delivery requirements, quantities, customization).
                  4. Format the final output as a detailed and professional request that solution providers can act on immediately.
                  5. Maintain a friendly and professional tone throughout.

                  Example Workflow:
                  1. User starts with a simple statement like, "I need a chair for my office."
                  2. AI responds: "Got it! Could you share more details? What type of chair are you looking for—ergonomic, gaming, or standard? Do you have a specific style or color preference?"
                  3. AI continues: "What’s your budget, and when do you need it delivered? Should it be assembled on-site, or are you okay with assembling it yourself?"
                  4. Once all details are gathered, summarize: "Thank you! Here’s your request: John from New York is looking for an ergonomic chair in black, with a budget of $300, to be delivered and assembled by Friday at his office. Let me find solution providers who can fulfill this request."

                  Your ultimate goal is to ensure users feel guided and supported while creating requests that providers can fulfill efficiently.`,
              },
              { role: "user", content: userMessage },
          ],
      });

      const reply = response.choices[0].message.content;
      res.json({ reply });
  } catch (error) {
      console.error("Error with OpenAI API:", error.message);
      res.status(500).json({ error: "An error occurred while communicating with OpenAI." });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
