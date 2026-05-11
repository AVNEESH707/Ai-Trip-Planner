// ============================================================
// OpenRouter API Configuration
// ============================================================

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const OPENROUTER_API_URL =
  "https://openrouter.ai/api/v1/chat/completions";

/**
 * Calls OpenRouter API and returns response text
 * @param {string} prompt
 * @returns {Promise<string>}
 */
export async function askGemini(prompt) {
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: "deepseek/deepseek-chat",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.85,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error(err);
      throw new Error(
        err?.error?.message || "OpenRouter API Error"
      );
    }

    const data = await response.json();

    return data?.choices?.[0]?.message?.content || "";
  } catch (error) {
    console.error("API Error:", error);
    return "Failed to generate trip plan.";
  }
}

/**
 * Builds the trip planning prompt
 */
export function buildTripPrompt({
  destination,
  days,
  budget,
  interests,
  travelStyle,
}) {
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