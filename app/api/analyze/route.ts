import { type NextRequest, NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

/**
 * Extract the first valid JSON object from a string.
 * This removes common wrappers such as ```json ... ``` or ``` ... ``` and
 * gracefully falls back if those wrappers are absent.
 */
function extractJSON(raw: string): any {
  // 1. Strip fenced-code blocks if present
  let cleaned = raw
    .trim()
    .replace(/^```json/i, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim()

  // 2. If the model still wrapped the JSON in explanatory text,
  //    attempt to locate the first “{” and last “}”
  if (!cleaned.startsWith("{") && cleaned.includes("{")) {
    cleaned = cleaned.slice(cleaned.indexOf("{"))
  }
  if (!cleaned.endsWith("}") && cleaned.lastIndexOf("}") !== -1) {
    cleaned = cleaned.slice(0, cleaned.lastIndexOf("}") + 1)
  }

  return JSON.parse(cleaned)
}

/**
 * POST /api/analyze
 * Body: { text: string }
 * Response: { analysis: MentalHealthAnalysis }
 */
export async function POST(req: NextRequest) {
  try {
    const { text } = (await req.json()) as { text: string }
    if (!text) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 })
    }

    const { text: raw } = await generateText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct", {
        apiKey: process.env.GROQ_API_KEY,
      }),
      prompt: `
        You are a mental-health AI assistant.
        Analyse the student's text and respond ONLY with valid JSON:

        {
          "conditions": [...],
          "sentiment": "...",
          "riskLevel": "...",
          "wellnessScore": <0-100>,
          "summary": "...",
          "recommendations": [...]
        }

        Text:
        """${text}"""
      `,
    })

    const analysis = extractJSON(raw)

    return NextResponse.json({ analysis })
  } catch (err) {
    console.error("Groq analysis failed:", err)
    return NextResponse.json(
      {
        error: "Unable to analyse text. Please try again in a few minutes. If the issue persists, contact support.",
      },
      { status: 500 },
    )
  }
}
