import { chatCompletion } from "@/lib/groq-client";

export async function GET() {
  try {
    const prompt = `Generate 1 multiple-choice technical interview question in JSON format only as { "questions": [ { "question": "string", "options": ["a","b","c","d"], "correctAnswer": "a", "explanation": "string" } ] }`;

    const result = await chatCompletion({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return Response.json({ ok: true, result });
  } catch (err) {
    console.error("/api/test-quiz error:", err);
    return Response.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}
