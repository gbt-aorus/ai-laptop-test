'use client'

import { useSearchParams } from "next/navigation"

export default function ResultPage() {
  const params = useSearchParams()
  const imageUrl = params.get("img")
  const laptop = params.get("laptop")

  const rawLaptopInfo = {
    gaming: {
      name: "GIGABYTE GAMING A16",
      desc: "強大效能、RGB 爆發、超頻與霸氣，讓你打爆不卡"
    },
    creator: {
      name: "GIGABYTE AERO X16",
      desc: "色準專業、高效創作，是設計師與攝影師的好夥伴"
    },
    general: {
      name: "GIGABYTE U4",
      desc: "輕薄文書、筆電開關隨插即用，日常生活好幫手"
    }
  }
  
  // 用查表方式取得
  const laptopInfo = rawLaptopInfo[(laptop || "general") as keyof typeof rawLaptopInfo]

  

  return (
    <main className="p-6 max-w-2xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">你的 AI 合圖來啦！</h1>

      {imageUrl && (
        <img src={imageUrl} alt="AI result" className="rounded-xl shadow mb-6" />
      )}

      {laptopInfo && (
        <div className="bg-gray-100 p-4 rounded-lg space-y-2">
          <h2 className="text-xl font-semibold">為你推薦：</h2>
          <p className="text-lg font-bold">{laptopInfo.name}</p>
          <p>{laptopInfo.desc}</p>
        </div>
      )}

      <a href="/" className="inline-block mt-6 text-blue-500 underline">
        再測一次 →
      </a>
    </main>
  )
}
