import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { message } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const response = await client.responses.create({
      model: "gpt-5.6",
      instructions:
        "You are Myanmar AI Helper. " +
        "Answer clearly, naturally, and helpfully. " +
        "If the user writes Burmese, answer in Burmese. " +
        "If the user writes English, answer in English. " +
        "Be friendly and concise.",
      input: message.trim(),
    });

    return res.status(200).json({
      reply: response.output_text,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "AI request failed",
    });
  }
}
```0
