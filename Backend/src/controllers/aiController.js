import { parseAdminIntent } from "../services/aiOpenAIService.js";
import { executeAiAction } from "../services/aiActionExecutor.js";

/**
 * POST /api/ai { message: string }
 * Requires X-Admin-Password + OPENAI_API_KEY
 */
export async function postAiHandler(req, res) {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message) {
    return res.status(400).json({ message: "message is required" });
  }
  try {
    const { action, params, reply } = await parseAdminIntent(message);
    if (action === "chat") {
      return res.json({
        reply: params._fallbackReply ? String(params._fallbackReply) : reply,
        action: "chat",
        result: null,
      });
    }
    const outcome = await executeAiAction(action, params);
    const finalReply = outcome.ok
      ? `${reply} ${outcome.message}`.trim()
      : `${reply} (${outcome.message})`.trim();
    return res.json({
      reply: finalReply,
      action,
      result: {
        ok: outcome.ok,
        message: outcome.message,
        data: outcome.data ?? null,
      },
    });
  } catch (err) {
    console.error("[postAiHandler]", err);
    const msg = err.message || "AI request failed";
    if (msg.includes("OPENAI_API_KEY")) {
      return res.status(503).json({ message: msg });
    }
    return res.status(500).json({ message: msg });
  }
}
