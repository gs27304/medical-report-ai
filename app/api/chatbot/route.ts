import { NextRequest, NextResponse } from "next/server"
import { chatMedicalAdvisor } from "@/lib/gemini"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const question = body?.question?.toString()?.trim()

    if (!question) {
      return NextResponse.json(
        { success: false, error: "Question is required." },
        { status: 400 }
      )
    }

    let answer: string
    try {
      answer = await chatMedicalAdvisor(question)
    } catch (error: any) {
      console.error("Chatbot API error:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to generate an answer from Gemini.",
          details: error?.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, answer })
  } catch (error: any) {
    console.error("Chatbot route error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Invalid request body.",
        details: error?.message,
      },
      { status: 400 }
    )
  }
}
