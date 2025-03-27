import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function inferLaptopType(style: string): "gaming" | "creator" | "general" {
  if (style.includes("戰士")) return "gaming";
  if (style.includes("藝術")) return "creator";
  return "general";
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const color = formData.get("color") as string;
    const style = formData.get("style") as string;
    const deskItems = formData.get("deskItems") as string;
    const image = formData.get("image") as File;

    if (!color || !style || !deskItems || !image) {
      return new NextResponse("Missing form data", { status: 400 });
    }

    const imageBuffer = await image.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString("base64");

    const chatPrompt = `
Please generate a visual image prompt (for DALL·E) based on the following personality and style input:
- Mood color: ${color}
- Working style: ${style}
- Items on the desk: ${deskItems}
Please describe the scene in English as a surreal or stylized digital artwork.`;

    const chatRes = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: chatPrompt }],
    });

    const dallePrompt = chatRes.choices[0].message.content || "";

    const imgRes = await openai.images.generate({
      model: "dall-e-3",
      prompt: dallePrompt,
      n: 1,
      size: "1024x1024",
      response_format: "url",
    });

    const imageUrl = imgRes.data[0].url;

    return NextResponse.json({
      prompt: dallePrompt,
      imageUrl,
      laptopType: inferLaptopType(style),
    });
  } catch (error: any) {
    console.error("❌ Server Error:", error);
    return new NextResponse("Server Error: " + error.message, {
      status: 500,
    });
  }
}
