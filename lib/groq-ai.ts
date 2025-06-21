import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

export interface MentalHealthAnalysis {
  conditions: string[]
  sentiment: "positive" | "negative" | "neutral"
  riskLevel: "low" | "moderate" | "high" | "critical"
  wellnessScore: number
  summary: string
  recommendations: string[]
}

export async function analyzeMentalHealth(text: string): Promise<MentalHealthAnalysis> {
  try {
    const { text: analysis } = await generateText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct", {
        apiKey: process.env.GROQ_API_KEY || "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",
      }),
      prompt: `
        You are a mental health AI assistant analyzing student text for wellness assessment.
        
        Analyze the following text and provide a JSON response with:
        1. conditions: Array of detected mental health conditions (anxiety, depression, stress, etc.)
        2. sentiment: Overall sentiment (positive, negative, neutral)
        3. riskLevel: Risk assessment (low, moderate, high, critical)
        4. wellnessScore: Score from 0-100 (100 being excellent mental health)
        5. summary: Brief summary of the analysis
        6. recommendations: Array of general recommendations
        
        Text to analyze: "${text}"
        
        Respond only with valid JSON format.
      `,
    })

    return JSON.parse(analysis)
  } catch (error) {
    console.error("Error analyzing mental health:", error)
    // Fallback analysis
    return {
      conditions: ["general_wellness"],
      sentiment: "neutral",
      riskLevel: "moderate",
      wellnessScore: 50,
      summary: "Unable to complete full analysis. Please try again.",
      recommendations: ["Consider speaking with a mental health professional"],
    }
  }
}
