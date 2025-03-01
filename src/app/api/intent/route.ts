// src/api/intent/route.ts
import { NextResponse } from "next/server";

// Replace this with your real API key or environment variable
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    // 1. Call your hosted LLM endpoint (e.g., OpenAI)
    const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a shopping assistant. If you do not understand, please respond with [\"I didn't understand, please try again.\"]. Your goal is to extract the user's shopping intent from their text. If the user does specify which items to buy specifically, identify and return the items that are most suited to match their intent. Ask one question to better understand what the user wants. After, Respond with a JSON array of item names (strings) only. No additional text, no explanation, just the array. Example: [\"Watch\", \"Gaming Accessories\", \"Book\"]", 
          },
          {
            role: "user",
            content: text,
          },
        ],
      }),
    });

    const jsonData = await openAiRes.json();
    const rawMessage = jsonData.choices?.[0]?.message?.content ?? "";

    return NextResponse.json({ parsedIntent: rawMessage });
  } catch (error) {
    console.error("Error parsing intent:", error);
    return NextResponse.json(
      { error: "Failed to parse intent" },
      { status: 500 }
    );
  }
}
