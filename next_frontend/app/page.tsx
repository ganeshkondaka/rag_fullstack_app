'use client'

import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="max-w-2xl w-full text-center px-6">
        {/* Logo / Title */}
        <h1 className="text-4xl font-bold text-zinc-900">
          RAG Assistant
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-zinc-600 text-lg">
          Upload documents or crawl websites and ask questions using AI.
        </p>

        {/* Feature points */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-orange-600">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            📄 PDF & Website Support
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            🔍 Context-aware Answers
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            ⚡ Fast & Simple RAG
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push('/home')}
          className="mt-10 rounded-xl bg-black px-8 py-4 text-white text-sm font-medium hover:bg-zinc-900 shadow"
        >
          Get Started
        </button>

        {/* Footer text */}
        <p className="mt-6 text-xs text-zinc-500">
          Powered by Retrieval Augmented Generation
        </p>
      </div>
    </div>
  )
}
