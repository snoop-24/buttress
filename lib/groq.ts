/**
 * Server-only Groq client. The API key lives in GROQ_API_KEY (.env.local) and
 * must never reach the browser — only import this from server code (API routes
 * / server actions).
 */

import Groq from "groq-sdk";

let client: Groq | null = null;

export function getGroq(): Groq {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set — add it to .env.local");
  }
  if (!client) {
    client = new Groq({ apiKey });
  }
  return client;
}

/** Fast, capable model for the live on-stage generation.
 * Verified available on the account + JSON-mode compatible (~2.7s latency). */
export const GROQ_MODEL = "openai/gpt-oss-120b";
