export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">你的命定筆電是哪台？</h1>
      <p className="mb-6 text-lg text-gray-600">
        回答幾個問題＋上傳一張照片，讓 AI 為你創作一幅專屬畫作並推薦筆電！
      </p>
      <a
        href="/quiz"
        className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
      >
        開始測驗 →
      </a>
    </main>
  )
}
