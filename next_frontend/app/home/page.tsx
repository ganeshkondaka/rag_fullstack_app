'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { Link, Plus, Send } from 'lucide-react'
import ConfigureApiKeyDialog from '@/components/ConfigureApiKeyDialog'

const Homepage = () => {
  const [tool, setTool] = useState<'pdf' | 'website'>('pdf')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [uploadedfile, setUploadedfile] = useState<File | null>(null)
  const [showApiDialog, setShowApiDialog] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-200 p-6">
      <div className="mx-auto max-w-7xl grid grid-cols-12 gap-6 h-[calc(100vh-3rem)]">

        {/* LEFT PANEL */}
        <div className="col-span-4 rounded-3xl bg-white/80 backdrop-blur border border-zinc-200 shadow-lg p-6 flex flex-col">
          <h1 className="text-xl font-semibold text-zinc-900">
            RAG Assistant
          </h1>
          <p className="text-xs text-zinc-500 mt-1 mb-6">
            - Upload content or crawl a website and get details.
          </p>

          {/* TOOL SELECT */}
          <div className="flex gap-2 mb-6">
            {['pdf', 'website'].map((id) => (
              <button
                key={id}
                onClick={() => setTool(id as any)}
                className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition
                  ${tool === id
                    ? 'bg-black text-white shadow'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
              >
                {id.toUpperCase()}
              </button>
            ))}
          </div>

          {/* INPUT */}
          <div className="mb-6">
            {tool === 'website' ? (
              <div className="relative">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                <input
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-zinc-300 bg-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400 text-black"
                />
              </div>
            ) : (
              <label className="flex items-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 cursor-pointer hover:bg-zinc-100 transition">
                <Plus className="text-zinc-500" />
                <div>
                  <div className="text-sm text-zinc-700">
                    {uploadedfile ? uploadedfile.name : 'Upload PDF'}
                  </div>
                  <div className="text-xs text-zinc-500">
                    Only .pdf files supported
                  </div>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={(e) => setUploadedfile(e.target.files?.[0] ?? null)}
                />
              </label>
            )}
          </div>

          {/* CONFIG API */}
          <button
            onClick={() => setShowApiDialog(true)}
            className="rounded-xl border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 transition"
          >
            Configure API Key
          </button>

          {/* SUBMIT */}
          <button
            className="mt-auto rounded-xl bg-black px-4 py-3 text-sm font-medium text-white hover:bg-zinc-900 shadow-md"
          >
            Ingest Knowledge
          </button>
        </div>

        {/* RIGHT PANEL – CHAT */}
        <div className="col-span-8 rounded-3xl bg-white/80 backdrop-blur border border-zinc-200 shadow-lg flex flex-col overflow-hidden">

          {/* CHAT AREA */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            <div className="max-w-xl rounded-2xl bg-zinc-100 p-4 text-sm text-zinc-800 shadow-sm">
              Upload a source and start asking questions.
            </div>

            <div className="max-w-xl ml-auto rounded-2xl bg-black text-white p-4 text-sm shadow">
              What does this document talk about?
            </div>
          </div>

          {/* INPUT */}
          <div className="border-t border-zinc-200 bg-white/60 p-4 flex gap-3">
            <input
              placeholder="Ask something..."
              className="flex-1 rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-400"
            />
            <button className="rounded-xl bg-black p-3 text-white hover:bg-zinc-900 shadow">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      <ConfigureApiKeyDialog
        open={showApiDialog}
        onClose={() => setShowApiDialog(false)}
      />
    </div>
  )
}

export default Homepage