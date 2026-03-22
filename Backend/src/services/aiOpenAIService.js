import OpenAI from "openai";

const SYSTEM = `You are an admin assistant for Elsie Lash Studio (eyelash bookings). Parse the user's message and return ONLY valid JSON (no markdown) with this exact structure:
{
  "action": "<ACTION_NAME>",
  "params": { },
  "reply": "<one short sentence summarizing what you will do or answered>"
}

ACTION_NAME must be exactly one of:
- chat — use for greetings, thanks, or when no database change is needed. params: {}
- create_service — params: { "name": string, "price"?: number, "durationMinutes"?: number, "description"?: string }
- update_service — params: { "nameMatch": string (service name to find), "price"?: number, "durationMinutes"?: number, "description"?: string, "name"?: string (rename) }
- list_services — params: {}
- get_booking_stats — params: { "scope": "today" | "all" | "pending" }
- update_booking_status — params: { "fullNameContains": string, "status": "pending"|"confirmed"|"completed"|"cancelled" }
- delete_bookings — params: { "status"?: string, "month"?: "YYYY-MM", "nameContains"?: string } — require at least one filter; for "test" bookings use nameContains "test"
- create_gallery_item — params: { "title": string, "category"?: "Classic"|"Hybrid"|"Volume", "description"?: string, "imageUrl"?: string } — if user wants image upload without URL, set action chat and reply to use Gallery admin upload
- list_gallery — params: {}

Examples:
- "Add service Hybrid Lashes price 120 duration 90" → create_service name Hybrid Lashes price 120 durationMinutes 90
- "How many bookings today?" → get_booking_stats scope today
- "Mark Alice booking completed" → update_booking_status fullNameContains Alice status completed
- "Delete cancelled test bookings from March 2025" → delete_bookings status cancelled month 2025-03 nameContains test

Today is context: use get_booking_stats with scope today for "today" questions.`;

/**
 * @param {string} userMessage
 * @returns {Promise<{ action: string; params: Record<string, unknown>; reply: string }>}
 */
export async function parseAdminIntent(userMessage) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  const client = new OpenAI({ apiKey });
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: userMessage },
    ],
  });
  const raw = completion.choices[0]?.message?.content || "{}";
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { action: "chat", params: { _fallbackReply: raw }, reply: raw };
  }
  const action = typeof parsed.action === "string" ? parsed.action : "chat";
  const params = typeof parsed.params === "object" && parsed.params !== null ? parsed.params : {};
  const reply = typeof parsed.reply === "string" ? parsed.reply : "Done.";
  return { action, params, reply };
}
