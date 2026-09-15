export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    // Get message from frontend
    const { message } = req.body || {};

    // Check message
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    // Check API key
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is not configured"
      });
    }

    // Call OpenAI Responses API
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },

      body: JSON.stringify({
        model: "gpt-5.6",

        instructions:
          "You are Myanmar AI Helper. " +
          "Answer the user clearly, naturally, and helpfully. " +
          "When the user writes in Burmese, answer in Burmese. " +
          "When the user writes in English, answer in English. " +
          "Be friendly and easy to understand.",

        input: message.trim()
      })
    });

    // Read OpenAI response
    const data = await response.json();

    // Handle OpenAI error
    if (!response.ok) {
      console.error("OpenAI API error:", data);

      return res.status(response.status).json({
        error:
          data?.error?.message ||
          "OpenAI request failed"
      });
    }

    // Get generated text
    const reply = data.output_text;

    if (!reply) {
      return res.status(500).json({
        error: "No response text returned"
      });
    }

    // Send answer to frontend
    return res.status(200).json({
      reply: reply
    });

  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      error: "AI request failed"
    });
  }
}
