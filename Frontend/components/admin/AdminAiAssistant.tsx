"use client";

import { useState } from "react";
import { postAiAssistant, getApiErrorMessage, type ApiError } from "@/lib/api";

type Msg = { role: "user" | "assistant"; text: string };

/** Compact assistant card — matches rest of admin typography, not a full “dashboard redesign”. */
export default function AdminAiAssistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const pwd = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "";
    if (!pwd) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "Admin password is not configured. Set NEXT_PUBLIC_ADMIN_PASSWORD.",
        },
      ]);
      return;
    }
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setLoading(true);
    try {
      const res = await postAiAssistant(text);
      setMessages((m) => [...m, { role: "assistant", text: res.reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: getApiErrorMessage(err as ApiError) },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section aria-label="AI management assistant" className="rounded-2xl border border-borderSoft/60 bg-white p-5 shadow-soft">
      <h2 className="font-serif text-lg font-semibold tracking-tight text-charcoal">Management assistant</h2>
      <p className="mt-1 text-sm text-muted">
        Ask in plain English (e.g. bookings today, add a service). Requires{" "}
        <code className="rounded bg-cream/80 px-1 text-xs">OPENAI_API_KEY</code> on the server.
      </p>

      <div className="mt-4 max-h-48 overflow-y-auto rounded-xl border border-borderSoft/40 bg-cream/20 p-3 text-sm">
        {messages.length === 0 ? (
          <p className="text-muted">
            Example: &quot;How many bookings today?&quot; or &quot;Add service Classic Set, price 95, duration 60 minutes.&quot;
          </p>
        ) : (
          <ul className="space-y-2">
            {messages.map((msg, i) => (
              <li
                key={i}
                className={`rounded-lg border border-borderSoft/30 px-3 py-2 ${
                  msg.role === "user" ? "ml-6 border-gold/25 bg-cream/40" : "mr-6 bg-white"
                }`}
              >
                <span className="text-[10px] font-medium uppercase tracking-luxury-wide text-muted">
                  {msg.role === "user" ? "You" : "Assistant"}
                </span>
                <p className="mt-0.5 whitespace-pre-wrap text-charcoal">{msg.text}</p>
              </li>
            ))}
          </ul>
        )}
        {loading && <p className="mt-2 text-xs text-muted">…</p>}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
          placeholder="Type a question or command…"
          className="min-w-0 flex-1 rounded-lg border border-borderSoft/60 bg-cream/30 px-3 py-2 text-sm text-charcoal placeholder-muted focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/25"
          disabled={loading}
        />
        <button
          type="button"
          onClick={send}
          disabled={loading || !input.trim()}
          className="shrink-0 rounded-full border border-borderSoft/60 bg-white px-4 py-2 text-sm font-medium text-charcoal transition hover:bg-cream/50 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </section>
  );
}
