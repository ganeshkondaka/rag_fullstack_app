'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Send } from 'lucide-react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

interface Message {
    role: 'user' | 'ai'
    message: string
}

const ChatPanel = () => {
    const [userquery, setUserquery] = useState('')
    const [conversation, setConversation] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [apiKey, setApiKey] = useState<string | null>(null)
    const [model, setModel] = useState<string | null>(null)
    const [filename, setFilename] = useState<string | null>(null)
    const [isMounted, setIsMounted] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setApiKey(localStorage.getItem('rag-apiKey'))
        setModel(localStorage.getItem('rag-model'))
        setFilename(localStorage.getItem('pdf_filename'))
        setIsMounted(true)
    }, [filename])

    // Auto-scroll to bottom when conversation updates
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [conversation, isLoading])

    const markdownComponents = {
        p: ({ node, ...props }: any) => <p className="mb-2" {...props} />,
        ul: ({ node, ...props }: any) => <ul className="list-disc list-inside mb-2 ml-2" {...props} />,
        ol: ({ node, ...props }: any) => <ol className="list-decimal list-inside mb-2 ml-2" {...props} />,
        li: ({ node, ...props }: any) => <li className="mb-1" {...props} />,
        strong: ({ node, ...props }: any) => <strong className="font-bold" {...props} />,
        em: ({ node, ...props }: any) => <em className="italic" {...props} />,
        h1: ({ node, ...props }: any) => <h1 className="text-lg font-bold mb-2" {...props} />,
        h2: ({ node, ...props }: any) => <h2 className="text-base font-bold mb-2" {...props} />,
        h3: ({ node, ...props }: any) => <h3 className="text-sm font-bold mb-1" {...props} />,
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!userquery.trim() || !apiKey || !model) return

        // Add user message
        setConversation(prev => [...prev, { role: 'user', message: userquery }])
        setUserquery('')
        setIsLoading(true)
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
        try {
            const response = await axios.post(`${BACKEND_URL}/api/chat`, {
                model,
                apiKey,
                userquery,
                filename
            })

            // Add AI message
            setConversation(prev => [...prev,{ role: 'ai', message: response.data.response }])
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="col-span-1 md:col-span-8 flex flex-col rounded-3xl border border-zinc-200 bg-white shadow-md overflow-hidden">
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:px-6 space-y-4">
                {!isMounted ? (
                    <div className="text-sm text-zinc-500 text-center">
                        Loading...
                    </div>
                ) : conversation.length === 0 ? (
                    <div className="text-sm text-zinc-500 text-center">
                        Upload a source and start asking questions.
                    </div>
                ) : null}
                {filename && <div className=' text-xs px-2 p-1 inline sticky top-[-17px] text-green-400 font-bold bg-zinc-100 rounded-md '> <span className='animate-ping text-green-500 text-lg'>●</span> {filename}.pdf</div>}
                {conversation.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${
                            msg.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                            className={`max-w-2xl md:max-w-xl lg:max-w-2xl rounded-2xl px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm leading-relaxed shadow-sm space-y-1
                                ${
                                    msg.role === 'user'
                                        ? 'bg-gray-200 text-black'
                                        : 'bg-zinc-600 text-zinc-100'
                                }`}
                        >
                            {msg.role === 'ai' ? (
                                <ReactMarkdown components={markdownComponents}>
                                    {msg.message}
                                </ReactMarkdown>
                            ) : (
                                msg.message
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-xl rounded-2xl px-4 py-3 bg-zinc-600 shadow-sm">
                            <div className="flex gap-2">
                                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <form
                onSubmit={handleSendMessage}
                className="flex gap-2 md:gap-3 border-t border-zinc-200 bg-white p-3 md:p-4"
            >
                <input
                    value={userquery}
                    onChange={(e) => setUserquery(e.target.value)}
                    placeholder="Ask something..."
                    className="flex-1 rounded-xl border border-zinc-300 px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-black outline-none focus:ring-2 focus:ring-zinc-400"
                />
                <button
                    type="submit"
                    className="rounded-xl bg-black p-2 md:p-3 text-white hover:bg-zinc-900 shadow"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    )
}

export default ChatPanel
