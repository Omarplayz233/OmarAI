const express = require("express");
const path = require("path");
const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const MODEL_NAME = "models/chat-bison-001";
const API_KEY = process.env.API_KEY;

const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html when users access the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle chat messages
app.use(express.json());
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    // Define the initial message outside of generateChatbotResponse
    let messages = [
      { content: "Your name is OmarAI and you act like an AI chatbot." }, // Add your context message here
      { content: userMessage }, // Include the user's message
    ];

    // Call your Google AI Chatbot code to generate a response based on userMessage
    const chatbotResponse = await generateChatbotResponse(messages);

    // Send the chatbot's response back to the HTML interface
    res.json({ response: chatbotResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Modify generateChatbotResponse to accept messages as an argument
async function generateChatbotResponse(messages) {
  try {
    const result = await client.generateMessage({
      model: MODEL_NAME,
      prompt: { messages },
    });

    return result[0].candidates[0].content;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
