'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

function inferLaptopType(style: string): "gaming" | "creator" | "general" {
  if (style.includes("戰士")) return "gaming"
  if (style.includes("藝術")) return "creator"
  return "general"
}

export default function QuizPage() {
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [color, setColor] = useState("")
  const [style, setStyle] = useState("")
  const [deskItems, setDeskItems] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("color", color)
      formData.append("style", style)
      formData.append("deskItems", deskItems)

      const res = await fetch("/api/prompt", {
        method: "POST",
        body: formData,
      })

      const result = await res.json()
      const dallePrompt = result.dallePrompt

      // 如果有上傳圖片，轉 base64
let imageBase64 = null
if (imageFile) {
  const reader = new FileReader()
  imageBase64 = await new Promise<string | null>((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result as string)
    }
    reader.readAsDataURL(imageFile)
  })
}

      const imageRes = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: dallePrompt,
          model: "dall-e-3",
          size: "1024x1024",
          response_format: "url",
          n: 1,
          ...(imageBase64 && { image: imageBase64 })  // 有圖才加
        }),
      })
      
      const imageData = await imageRes.json()
      
      // 🛑 加這段錯誤檢查
      if (!imageData || !imageData.data || !Array.isArray(imageData.data) || !imageData.data[0]) {
        console.error("圖片 API 回傳異常：", imageData)
        alert("圖片生成失敗，請稍後再試 🥺")
        setIsLoading(false)
        return
      }
      
      const imageUrl = imageData.data[0].url
      

      const laptopType = inferLaptopType(style)

      router.push(`/result?img=${encodeURIComponent(imageUrl)}&laptop=${laptopType}`)
    } catch (error: any) {
      alert("發生錯誤：" + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <main className="p-6 max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center">AI 心理測驗</h1>

        {step === 1 && (
          <section>
            <label>🎨 你今天的心情顏色是？</label>
            <input
              type="text"
              className="border w-full p-2 mt-2"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <button
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => setStep(2)}
            >
              下一題
            </button>
          </section>
        )}

        {step === 2 && (
          <section>
            <label>🧘 你的工作風格像什麼？（藝術家 / 戰士 / 冒險家...）</label>
            <input
              type="text"
              className="border w-full p-2 mt-2"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            />
            <button
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded mr-2"
              onClick={() => setStep(1)}
            >
              上一題
            </button>
            <button
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => setStep(3)}
            >
              下一題
            </button>
          </section>
        )}

        {step === 3 && (
          <section>
            <label>💻 你的桌上通常會出現哪些東西？</label>
            <input
              type="text"
              className="border w-full p-2 mt-2"
              value={deskItems}
              onChange={(e) => setDeskItems(e.target.value)}
            />
            <button
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded mr-2"
              onClick={() => setStep(2)}
            >
              上一題
            </button>
            <button
              className="mt-4 bg-blue-700 text-white px-4 py-2 rounded"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "正在生成圖像..." : "送出資料 ➜ AI 合圖 →"}
            </button>
          </section>
        )}
      {/* 新增圖片上傳區塊 */}
        <div className="mt-6">
         <label className="block font-medium mb-2">📷 請上傳你現在的桌面一角（可選）</label>
          <input
             type="file"
             accept="image/*"
             onChange={(e) => {
               const file = e.target.files?.[0]
               if (file) {
                 setImageFile(file)
                 setImagePreview(URL.createObjectURL(file))
                }
             }}
         />
         {imagePreview && (
            <div className="mt-4 relative w-48">
              <img src={imagePreview} alt="預覽圖" className="rounded shadow" />
              <button
                className="absolute top-1 right-1 text-white bg-black/50 px-2 rounded text-sm"
                onClick={() => {
                 setImageFile(null)
                setImagePreview(null)
               }}
               >
        ✕
              </button>
    </div>
  )}
</div>

      </main>

      {/* 🐦 Loading 畫面 */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          {/* 這裡先用暫時動圖，之後可以放 AORUS 小鳥畫畫 GIF */}
          <img
            src="/aorus-bird-drawing.gif"
            alt="AORUS 小鳥正在畫畫"
            className="w-32 h-32 mb-4"
          />
          <p className="text-lg font-semibold text-gray-800">AI 正在構思你的命定筆電畫面...</p>
        </div>
      )}
    </>
  )
}
