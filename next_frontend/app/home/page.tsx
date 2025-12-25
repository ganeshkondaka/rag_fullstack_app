'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { Link, Plus } from 'lucide-react'
import ConfigureApiKeyDialog from '@/components/ConfigureApiKeyDialog'
import ChatPanel from '@/components/ChatPanel'

const Homepage = () => {
  const [tool, setTool] = useState('pdf')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [uploadedfile, setUploadedfile] = useState<File | null>(null)
  const [showApiDialog, setShowApiDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleTool = (e: React.FormEvent, id: string) => {
    e.preventDefault()
    const changedTool = id === 'pdf' ? 'pdf' : 'website'
    setTool(changedTool)
    setWebsiteUrl('')
    setUploadedfile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const apiKey = localStorage.getItem('rag-apiKey')
    const model = localStorage.getItem('rag-model')
    const existed_file = localStorage.getItem('pdf_filename')

    // Delete the existing file from the database if it exists
    if (existed_file !== null) {
      try {
        const response = await axios.delete('http://localhost:8000/api/delete-collection', { 
          data: { filename: existed_file } 
        })
        console.log('response from deleting collection is: ', response)
        alert(`previous file... ${existed_file} pdf deleted successfully!`)
      } catch (error) {
        console.error('Error deleting collection:', error)
      }
      localStorage.setItem('pdf_filename', '')
    }

    // Get the filename from the uploaded file
    const filename = (uploadedfile?.name ?? '').split('.')[0].trim().toLowerCase().replace(/ /g, '_')
    localStorage.setItem('pdf_filename', filename)

    // Check if the API keys and model are set
    if (!apiKey || !model) {
      setShowApiDialog(true)
      alert('Please configure your API keys first.')
      return
    }

    // Validate required fields based on selected tool
    if (tool === 'pdf' && !uploadedfile) {
      alert('Please select a PDF file to upload.')
      return
    }

    if (tool === 'website' && !websiteUrl.trim()) {
      alert('Please enter a website URL.')
      return
    }
    // same submit logic as before
    // console.log('tool is: ', tool)
    // console.log('websiteUrl is: ', websiteUrl)
    // console.log('uploadedfile is: ', uploadedfile)
    // console.log('apiKey is: ', apiKey)
    // console.log('model is: ', model)
    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('tool', tool)
      formData.append('apiKey', apiKey!)
      formData.append('model', model!)

      if (tool === 'pdf' && uploadedfile) {
        formData.append('file', uploadedfile)
      } else if (tool === 'website' && websiteUrl) {
        formData.append('websiteUrl', websiteUrl)
      }

      const response = await axios.post('http://localhost:8000/api/context', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('data sent to api formadata is: ', formData)
      alert('PDF Successfully processed!')
      // setUploadedfile(null)
      setWebsiteUrl('')
    } catch (error) {
      console.error('Error submitting:', error)
      alert('Error processing file. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    /*******  edcb0d93-fd5b-46bd-82c9-872b9b86640d  *******/
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-200 p-4 md:p-6">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 md:h-[calc(100vh-3rem)]">

        {/* LEFT PANEL */}
        <form
          onSubmit={handleSubmit}
          className={`col-span-1 md:col-span-4 rounded-3xl bg-white/90 backdrop-blur border border-zinc-200 shadow-lg p-4 md:p-6 flex flex-col transition-all ${isLoading ? 'opacity-50 pointer-events-none' : ''
            }`}
        >
          {isLoading && (
            <div className="absolute inset-0 rounded-3xl bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-8 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-8 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-8 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <p className="text-white text-md font-extrabold">Processing...</p>
              </div>
            </div>
          )}
          <h1 className="text-xl font-semibold text-zinc-900">
            RAG Assistant
          </h1>
          <p className="text-xs text-zinc-500 mt-1 mb-4 md:mb-6">
            Upload a document or crawl a website
          </p>

          {/* TOOL BUTTONS – SAME AS ORIGINAL */}
          <div className="mb-4 md:mb-6">
            <label className="text-xs font-medium text-zinc-600">
              Select mode
            </label>

            <div className="flex gap-2 md:gap-3 mt-2">
              <button
                type="button"
                id="pdf"
                onClick={(e) => handleTool(e, 'pdf')}
                className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition
                  ${tool === 'pdf'
                    ? 'bg-black text-white shadow-md'
                    : 'bg-zinc-100 text-zinc-700 border border-zinc-300 hover:bg-zinc-200'
                  }`}
              >
                PDF
              </button>

              <button
                type="button"
                id="website"
                disabled
                onClick={(e) => handleTool(e, 'website')}
                className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition 
                  ${tool === 'website'
                    ? 'bg-black text-white shadow-md'
                    : 'bg-zinc-100 text-zinc-700 border border-zinc-300 hover:bg-zinc-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                WEBSITE
              </button>
            </div>
          </div>

          {/* INPUT – SAME STRUCTURE */}
          <div className="mb-4 md:mb-6">
            <label className="text-xs font-medium text-zinc-600 mb-1 inline-block">
              {tool === 'website'
                ? 'Website URL to crawl'
                : 'Upload PDF to index'}
            </label>

            {tool === 'website' ? (
              <div className="relative">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  value={websiteUrl}
                  required
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-zinc-300 bg-zinc-50 outline-none focus:ring-2 focus:ring-zinc-400 text-black"
                />
              </div>
            ) : (
              <div className={`flex items-center gap-3 rounded-xl border border-dashed border-zinc-300 ${uploadedfile ? "bg-green-100" : "bg-zinc-50"} px-1 py-3`}>
                <label className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-zinc-100 rounded-lg p-2 transition">
                  <Plus className="text-zinc-500" />
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs text-zinc-700 truncate font-bold`}>
                      {uploadedfile ? (uploadedfile.name.length > 10 ? uploadedfile.name.slice(0, 15) + '...pdf' : uploadedfile.name) : 'Choose PDF file'}
                    </div>
                    <div className="text-xs text-zinc-400">
                      Only .pdf supported
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".pdf"
                    hidden
                    onChange={(e) =>
                      setUploadedfile(e.target.files?.[0] ?? null)
                    }
                  />
                </label>
              </div>
            )}
          </div>

          {/* CONFIG API */}
          <button
            onClick={() => setShowApiDialog(true)}
            type='button'
            className="mb-3 md:mb-4 rounded-xl border border-zinc-300 px-3 md:px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 transition w-full md:w-auto">

            Configure API Key
          </button>
          <div>

          </div>

          {/* SUBMIT */}
          <button
            type='submit'
            disabled={isLoading}
            className={`mt-4 md:mt-auto rounded-xl px-3 md:px-4 py-3 text-sm font-medium shadow-md transition w-full md:w-auto ${isLoading
              ? 'bg-zinc-400 text-gray-600 cursor-not-allowed'
              : 'bg-black text-white hover:bg-zinc-900'
              }`}
          >
            {isLoading ? 'Processing...' : 'Submit'}
          </button>
        </form>

        <ChatPanel />
      </div>

      <ConfigureApiKeyDialog
        open={showApiDialog}
        onClose={() => setShowApiDialog(false)}
      />
    </div>
  )
}

export default Homepage