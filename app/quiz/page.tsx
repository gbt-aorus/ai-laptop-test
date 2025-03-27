'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function QuizPage() {
  const [step, setStep] = useState(1)

  const [color, setColor] = useState("")
  const [style, setStyle] = useState("")
  const [deskItems, setDeskItems] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState("")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }
  const router = useRouter()
  return (
    <main className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">AI 心理測驗</h1>

      {/* 問題一 */}
      {step === 1 && (
        <div className="space-y-4">
          <p>Q1：如果你今天是一種顏色，你會是什麼？為什麼？</p>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="例：藍色，因為我今天很冷靜"
            className="w-full p-2 border rounded"
          />
          <button
            onClick={() => setStep(2)}
            className="bg-black text-white px-4 py-2 rounded"
            disabled={!color}
          >
            下一題 →
          </button>
        </div>
      )}

      {/* 問題二 */}
      {step === 2 && (
        <div className="space-y-4">
          <p>Q2：當你工作或創作時，你比較像？</p>
          <div className="space-y-2">
            {["全力衝刺的戰士", "靜靜創作的藝術家", "放鬆泡茶的資料收集者"].map((opt) => (
              <label key={opt} className="block border p-2 rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="style"
                  value={opt}
                  checked={style === opt}
                  onChange={(e) => setStyle(e.target.value)}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="text-blue-500">← 回上題</button>
            <button
              onClick={() => setStep(3)}
              className="bg-black text-white px-4 py-2 rounded"
              disabled={!style}
            >
              下一題 →
            </button>
          </div>
        </div>
      )}

      {/* 問題三 */}
      {step === 3 && (
        <div className="space-y-4">
          <p>Q3：你想在桌面放哪三樣東西？（越具體越好）</p>
          <input
            type="text"
            value={deskItems}
            onChange={(e) => setDeskItems(e.target.value)}
            placeholder="例：耳機、貓咪、草地小盆栽"
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-between">
            <button onClick={() => setStep(2)} className="text-blue-500">← 回上題</button>
            <button
              onClick={() => setStep(4)}
              className="bg-black text-white px-4 py-2 rounded"
              disabled={!deskItems}
            >
              下一題 →
            </button>
          </div>
        </div>
      )}

      {/* 問題四：圖片上傳 */}
      {step === 4 && (
        <div className="space-y-4">
          <p>Q4：上傳一張你最近拍的照片</p>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && (
            <img src={preview} alt="preview" className="mt-2 rounded shadow w-full" />
          )}
          <div className="flex justify-between">
            <button onClick={() => setStep(3)} className="text-blue-500">← 回上題</button>
            <button
              onClick={() => setStep(5)}
              className="bg-black text-white px-4 py-2 rounded"
              disabled={!image}
            >
              看結果 →
            </button>
          </div>
        </div>
      )}

      {/* 下一步提示 */}
      {step === 5 && (
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold">🧠 資料準備好了！</p>
          <p>將送給 AI 生成你的合圖與推薦</p>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={async () => {
              const formData = new FormData()
              formData.append("color", color)
              formData.append("style", style)
              formData.append("deskItems", deskItems)
              if (image) formData.append("image", image)

              const res = await fetch("/api/generate", {
                method: "POST",
                body: formData,
              })

              if (!res.ok) {
                const errorText = await res.text()
                alert("發生錯誤：" + errorText)
                return
              }

              const data = await res.json()
              router.push(`/result?img=${encodeURIComponent(data.imageUrl)}&laptop=${data.laptopType}`)
            }}
          >
            送出資料 ➜ AI 合圖 →
          </button>
        </div>
      )}
    </main>
  )
}
