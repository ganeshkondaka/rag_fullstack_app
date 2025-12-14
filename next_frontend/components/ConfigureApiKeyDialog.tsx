'use client'
import React, { useState } from 'react'

interface Props {
  open: boolean
  onClose: () => void
}

const ConfigureApiKeyDialog: React.FC<Props> = ({ open, onClose }) => {
  const [model, setModel] = useState<'openai' | 'gemini'>('openai')
  const [apiKey, setApiKey] = useState('')

  if (!open) return null
  const handleKeysave = ()=>{
    localStorage.setItem('rag-model', model)
    localStorage.setItem('rag-apiKey', apiKey)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white border border-zinc-200 shadow-2xl p-6">
        <h2 className="text-lg font-semibold text-zinc-900">
          API Configuration
        </h2>
        <p className="text-xs text-zinc-500 mt-1">
          Keys are stored locally and never logged
        </p>

        <div className="mt-6 space-y-4">
          {/* PROVIDER */}
          <div>
            <label className="text-xs font-medium text-zinc-700">
              Provider
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value as any)}
              className="
                mt-1 w-full rounded-xl border border-zinc-300 
                bg-white px-3 py-2 text-sm text-black
                outline-none focus:ring-2 focus:ring-zinc-400
                cursor-pointer
              "
            >
              <option value="openai" className="text-black bg-white">
                OpenAI
              </option>
              <option value="gemini" className="text-black bg-white">
                Gemini
              </option>
            </select>
          </div>

          {/* API KEY */}
          <div>
            <label className="text-xs font-medium text-zinc-700">
              API Key
            </label>
            <input
              type="text"
              required
              autoComplete="off"
              autoCorrect="off"
              value={apiKey}
              onChange={(e) => setApiKey((e.target.value))}
              placeholder="sk-••••••••••••"
              className="
                mt-1 w-full rounded-xl border border-zinc-300
                bg-white px-3 py-2 text-sm text-black
                placeholder-zinc-400
                outline-none focus:ring-2 focus:ring-zinc-400
              "
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleKeysave}
            type='button'
            className="px-5 py-2 text-sm rounded-xl bg-black text-white hover:bg-zinc-900 shadow"
          >
            Save Key
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfigureApiKeyDialog
