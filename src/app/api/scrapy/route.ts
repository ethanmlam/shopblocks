// src/app/api/amazon/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { ScrapybaraClient } from "scrapybara";
import { anthropic } from "scrapybara/anthropic";
import { UBUNTU_SYSTEM_PROMPT } from "scrapybara/prompts";
import { browserTool } from "scrapybara/tools";

// Optional: A small step-logger to debug agent output
function handleStep(step: any) {
  console.log("\n--- Agent Step Output ---");
  console.log(step.text);
  if (step.tool_calls) {
    step.tool_calls.forEach((call: any) => {
      console.log(`Tool used: ${call.tool_name}`);
    });
  }
}

export async function POST(request: Request) {
  try {
    const { items } = await request.json();
    const searchTerm = items?.[0] || "laptop";

    // 1. Create a Scrapybara client
    const client = new ScrapybaraClient({
      apiKey: process.env.SCRAPYBARA_API_KEY || "",
    });

    // 2. Start Ubuntu instance & browser
    const instance = await client.startUbuntu();
    await instance.browser.start();

    try {
      // 3. Load the browserTool
      const tools = [browserTool(instance)];

      // 4. Act with Anthropic
      const { output } = await client.act({
        model: anthropic(), // or anthropic({ apiKey: "YOUR_ANTHROPIC_KEY" })
        tools,
        system: UBUNTU_SYSTEM_PROMPT,
        prompt: `
          You have a tool called "browser" that supports commands: "go_to", "click", "type", "get_html", etc.
          1) "go_to" with url to open a webpage
          2) "type" with selector + text to fill a search box
          3) "click" with selector to click the search button
          4) "get_html" to retrieve the page HTML

          Task: 
          - Open "https://www.amazon.com"
          - Type "${searchTerm}" into the search box (selector "#twotabsearchtextbox")
          - Click the search button (selector "#nav-search-submit-button")
          - Then get the HTML
          - Return the final HTML as your answer, strictly in JSON

          Example final answer:
          { "html": "<html>some partial snippet</html>" }

          Make sure to produce valid JSON with no code fences.
        `,
        onStep: handleStep,
      });

      // 5. Output is whatever the agent decided to return
      if (!output) {
        return NextResponse.json({ error: "No output from agent" }, { status: 500 });
      }

      // If it returned an object like { html: "..." }, just pass it along
      return NextResponse.json(output);
    } finally {
      // 6. Cleanup
      await instance.browser.stop();
      await instance.stop();
    }
  } catch (err: any) {
    console.error("Scrapybara Amazon route error:", err);
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
