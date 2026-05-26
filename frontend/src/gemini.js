// ============================================================
// OpenRouter API Configuration
// ============================================================

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Single API call attempt
 */
async function callOpenRouter(prompt) {
  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.85,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || "";

  if (!content) throw new Error("Empty response from API");
  return content;
}

/**
 * Calls OpenRouter API with automatic retry (3 attempts)
 * @param {string} prompt
 * @returns {Promise<string>}
 */
export async function askGemini(prompt) {
  const MAX_RETRIES = 3;
  const DELAY_MS = 1500;

  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`🔄 API attempt ${attempt}/${MAX_RETRIES}`);
      const result = await callOpenRouter(prompt);
      console.log(`✅ API succeeded on attempt ${attempt}`);
      return result;
    } catch (err) {
      lastError = err;
      console.warn(`⚠️ Attempt ${attempt} failed:`, err.message);

      // Wait before retrying (except on last attempt)
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, DELAY_MS * attempt));
      }
    }
  }

  // All retries failed — throw so App.jsx shows the error state
  throw new Error(
    `Failed after ${MAX_RETRIES} attempts: ${lastError?.message || "Unknown error"}`
  );
}

/**
 * Builds the trip planning prompt
 */
export function buildTripPrompt({ destination, days, budget, interests, travelStyle }) {
  return `You are an expert luxury travel planner.

Create a detailed ${days}-day trip itinerary for ${destination}.

Traveler profile:
- Budget level: ${budget}
- Interests: ${interests}
- Travel style: ${travelStyle}

Please provide a well-structured itinerary in the following JSON format ONLY (no markdown, no explanation, pure JSON):

{
  "tripTitle": "string",
  "destination": "string",
  "duration": "string",
  "highlights": ["string", "string", "string"],
  "days": [
    {
      "day": 1,
      "theme": "string",
      "morning": {
        "activity": "string",
        "description": "string",
        "tip": "string"
      },
      "afternoon": {
        "activity": "string",
        "description": "string",
        "tip": "string"
      },
      "evening": {
        "activity": "string",
        "description": "string",
        "tip": "string"
      },
      "accommodation": "string",
      "estimatedCost": "string"
    }
  ],
  "packingEssentials": ["string"],
  "bestTimeToVisit": "string",
  "localTips": ["string", "string", "string"]
}`;
}