'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { Link, Plus } from 'lucide-react'

const Homepage = () => {
  const [tool, setTool] = useState('pdf')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [uploadedfile, setUploadedfile] = useState<File | null>(null)

  const handleTool = (e: React.FormEvent, id: string) => {
    e.preventDefault()
    const changedTool = (id == "pdf" ? "pdf" : "website")
    setTool(changedTool)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (tool == 'pdf' && uploadedfile) {
      const formdata = new FormData()
      formdata.append('file', uploadedfile)
      formdata.append('tool', tool)

      console.log('website submitted formdata issss', formdata)
      try {
        const response = await axios.post('localhost:3000/upload', formdata)
        console.log('uploaded succesfully', response.data)
      } catch (error) {
        console.log('upload failed..', error)
      }

    } else if (tool == 'website' && websiteUrl) {
      console.log('website submitted', websiteUrl, 'tool iss', tool)
      try {
        const response = await axios.post('localhost:3000/upload', { websiteUrl, tool })
        console.log("website url sent successfully", response.data)
      } catch (error) {
        console.log('websiteurl submission failed..', error)
      }

    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement> | null) {
    const f = e?.target?.files?.[0] ?? null
    if (f) setUploadedfile(f)
  }

  function removeFile() {
    setUploadedfile(null)
  }
  console.log('tool outside--- issss', tool)

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="relative overflow-hidden rounded-2xl p-8 bg-white border border-slate-200 shadow-xl">

          {/* light funky blobs */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-300/30 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-300/30 rounded-full blur-3xl pointer-events-none"></div>

          <header className="mb-6 text-center">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-300">
              RAG Assistant — Upload & Search Knowledge
            </h1>
            <p className="mt-2 text-gray-400 text-sm bg-zinc-100 p-2 rounded-md">
              Ingest documents or web pages to create a searchable knowledge base. Upload a PDF or paste a website URL to index content and ask questions.
            </p>
          </header>

          <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-6">

            {/* TOOLS */}
            <div>
              <label className="text-sm text-gray-600 font-medium">Select mode</label>
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  id="pdf"
                  onClick={(e) => handleTool(e, 'pdf')}
                  className={`flex-1 px-5 py-7 rounded-md text-sm font-semibold transition shadow-sm ${tool === 'pdf'
                    ? 'bg-gradient-to-r from-blue-300 to-blue-300 text-white shadow-md hover:scale-105'
                    : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
                    }`}
                >
                  PDF
                </button>

                <button
                  type="button"
                  id="website"
                  onClick={(e) => handleTool(e, 'website')}
                  className={`flex-1 px-5 py-2 rounded-md text-sm font-semibold transition shadow-sm ${tool === 'website'
                    ? 'bg-gradient-to-r from-yellow-300 to-yellow-300 text-white shadow-md hover:scale-105'
                    : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
                    }`}
                >
                  WEBSITE
                </button>
              </div>
            </div>

            {/* INPUT FIELD */}
            <div>
              <label className="text-sm text-gray-600 font-medium mb-1 inline-block">
                {tool === 'website' ? 'Website URL to crawl & index' : 'Upload PDF to index'}
              </label>

              {tool === 'website' ? (
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    key={'text'}
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full pl-10 pr-4 py-3 text-zinc-800 bg-slate-50 border border-slate-300 rounded-lg shadow-sm focus:ring-1 focus:ring-zinc-200 outline-none"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 w-full px-1 bg-slate-50 border border-slate-300 rounded-xl shadow-sm">
                  <label className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-slate-100 transition rounded-lg p-2">
                    <Plus className="text-zinc-400" />
                    <div className="flex-1">
                      <div className="text-sm text-slate-700">
                        {uploadedfile ? uploadedfile.name : 'Choose a PDF file'}
                      </div>
                      <div className="text-xs text-slate-500">
                        {uploadedfile ? `${(uploadedfile.size / 1024).toFixed(0)} KB` : 'Only .pdf allowed'}
                      </div>
                    </div>
                    <input
                      key={'file'}
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange(e)}
                      className="hidden"
                    />
                  </label>
                  {uploadedfile && (
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-sm px-3 py-1 bg-red-400 text-white rounded-lg shadow hover:bg-red-500 transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* SUBMIT */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-500 shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform"
              >
                Submit
              </button>
            </div>
          </form>

          <div className="text-xs text-gray-500 mt-4">
            Debug: tool = <span className="font-semibold text-blue-600">{tool}</span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Homepage
