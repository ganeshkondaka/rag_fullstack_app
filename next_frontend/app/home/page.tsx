'use client'
import React, { useState } from 'react'

const Homepage = () => {
  const [tool, setTool] = useState('pdf')
  const handleTool = (e:React.FormEvent,id:string) => {
    e.preventDefault()
    const changedTool = (id == "pdf" ? "pdf" : "website")
    setTool(changedTool)
  }
  console.log('tool outside--- issss',tool)
  return (
    <div className='flex flex-col items-center w-full h- justify-center bg-gray gap-2 min-h-screen'>
      <form
        action=""
        className='flex flex-col items-center justify-center gap-2'>
        <div className='flex gap-2'>
          <button id='pdf' onClick={(e) => handleTool(e,'pdf')}>PDF</button>
          <button id='website' onClick={(e) => handleTool(e,'website')}>WEBSITE</button>
        </div>
        <input type="text" className='outline'/>
        <button>Send</button>
      </form>
    </div>
  )
}

export default Homepage