import { NextRequest, NextResponse } from "next/server"
import { OpenAI } from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const color = formData.get("color") as string
    const style = formData.get("style") as string
    const deskItems = formData.get("deskItems") as string

    const chatPrompt = `
Please generate a visual image prompt (for DALL·E) based on the following personality and style input:
- Mood color: ${color}
- Working style: ${style}
- Items on the desk: ${deskItems}
Please describe the scene in English as a surreal or stylized digital artwork.`

    const chatRes = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: chatPrompt }],
    })

    const dallePrompt = chatRes.choices[0].message.content || ""

    return NextResponse.json({ dallePrompt })
  } catch (error: any) {
    return new NextResponse("Server Error: " + error.message, { status: 500 })
  }
}
