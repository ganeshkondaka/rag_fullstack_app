'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { url } from 'inspector'

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

  console.log('tool outside--- issss', tool)
  return (
    <div className='flex flex-col items-center w-full h- justify-center bg-gray gap-2 min-h-screen'>
      <form
        action=""
        onSubmit={(e) => { handleSubmit(e) }}
        className='flex flex-col items-center justify-center gap-2'>
        <div className='flex gap-2'>
          <button id='pdf' onClick={(e) => handleTool(e, 'pdf')}>PDF</button>
          <button id='website' onClick={(e) => handleTool(e, 'website')}>WEBSITE</button>
        </div>
        {
          tool == "website" ?
            <input
              key={'text'}
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className='outline'
            />
            :
            <input
              key={'file'}
              type="file"
              accept=".pdf"
              onChange={(e) => setUploadedfile(e.target.files?.[0] || null)}
              className='outline'
            />
        }
        <button type='submit'>submit</button>
      </form>
    </div>
  )
}

export default Homepage