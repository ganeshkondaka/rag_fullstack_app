'use client'
import React, { useState } from 'react'
import { Send } from 'lucide-react'
import axios from 'axios'

const ChatPanel = () => {
    const [userquery, setUserquery] = useState('')
    const [aireponse, setAireponse] = useState('')
    const [conversation, setConversation] = useState(
        {
            role: '',
            message: ''
        }
    )

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        const apiKey = localStorage.getItem('rag-apiKey')
        const model = localStorage.getItem('rag-model')

        try {
            const response = await axios.post('http://localhost:8000/api/chat',{model, apiKey, userquery})
            console.log('ai reponse for user quiery iss::', response)
        } catch (error) {

        }

    }

    return (
        <div className="col-span-8 rounded-3xl bg-white/90 backdrop-blur border border-zinc-200 shadow-lg flex flex-col overflow-hidden">
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                <div className="max-w-xl rounded-2xl bg-zinc-100 p-4 text-sm text-zinc-800 shadow-sm">
                    Upload a source and ask questions here.
                </div>

                <div className="max-w-xl ml-auto rounded-2xl bg-black text-white p-4 text-sm shadow">
                    What is this document about?
                </div>
            </div>

            <div className="border-t border-zinc-200 bg-white/60 p-4 flex gap-3">
                <input
                    value={userquery}
                    onChange={(e) => setUserquery(e.target.value)}
                    placeholder="Ask something..."
                    className="flex-1 rounded-xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-400 text-black"
                />
                <button
                    type='submit'
                    onClick={handleSendMessage}
                    className="rounded-xl bg-black p-3 text-white hover:bg-zinc-900 shadow"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    )
}

export default ChatPanel
