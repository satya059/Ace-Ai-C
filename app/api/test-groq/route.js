import { chatCompletion } from "@/lib/groq-client";

export async function GET() {
  try {
    console.log("Testing Groq API...");
    console.log("GROQ_API_KEY present:", !!process.env.GROQ_API_KEY);
    console.log("GROQ_MODEL:", process.env.GROQ_MODEL);

    const result = await chatCompletion({
      messages: [
        {
          role: "user",
          content: "Respond with 'Hello' only.",
        },
      ],
      temperature: 0.7,
      max_tokens: 10,
    });

    console.log("Groq API response:", result);

    return Response.json({
      success: true,
      message: "Groq API is working",
      data: result,
      env: {
        hasApiKey: !!process.env.GROQ_API_KEY,
        model: process.env.GROQ_MODEL,
      },
    });
  } catch (error) {
    console.error("Test failed:", error);
    return Response.json(
      {
        success: false,
        error: error.message,
        details: error,
      },
      { status: 500 }
    );
  }
}
