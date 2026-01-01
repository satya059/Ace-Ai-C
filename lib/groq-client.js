import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Use the desired model by default; allow overrides via env
const DEFAULT_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const FALLBACK_MODELS = (process.env.GROQ_FALLBACK_MODELS || "llama-3.3-70b-versatile,gemma-7b-it,gemma-1.5")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export async function chatCompletion(options = {}) {
  const {
    model = process.env.GROQ_MODEL || DEFAULT_MODEL,
    messages,
    temperature,
    max_tokens,
    ...rest
  } = options;

  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY environment variable is not set");
  }

  // Try primary model first
  try {
    console.log(`[Groq] Using model: ${model}, API Key present: ${!!process.env.GROQ_API_KEY}`);
    const response = await groq.chat.completions.create({
      model,
      messages,
      temperature: temperature || 0.7,
      max_tokens: max_tokens || 1024,
      ...rest,
    });
    console.log(`[Groq] Success with model ${model}`);
    return response;
  } catch (err) {
    const code = err?.error?.code || err?.code || err?.status;
    console.error(`[Groq] Error with model ${model}:`, err?.message || err);
    console.error(`[Groq] Error code:`, code);
    
    if (code === "model_decommissioned" || code === "model_not_found" || err?.message?.includes("model")) {
      console.log(`[Groq] Trying fallback models: ${FALLBACK_MODELS.join(", ")}`);
      for (const fb of FALLBACK_MODELS) {
        if (fb === model) continue;
        try {
          console.warn(`[Groq] Primary model ${model} unavailable; retrying with ${fb}`);
          const response = await groq.chat.completions.create({
            model: fb,
            messages,
            temperature: temperature || 0.7,
            max_tokens: max_tokens || 1024,
            ...rest,
          });
          console.log(`[Groq] Success with fallback model ${fb}`);
          return response;
        } catch (e) {
          console.error(`[Groq] Fallback model ${fb} failed:`, e?.message || e);
        }
      }
      console.error(
        "[Groq] All fallback models failed or are inaccessible. Set GROQ_MODEL and GROQ_FALLBACK_MODELS in .env.local to models you have access to."
      );
    }

    throw err;
  }
}

export default groq;
