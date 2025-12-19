"use client"

import { useState, useRef, useEffect } from "react"
import { Send, User, Bot, Save, Loader2 } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { apiEntryPoint } from "@/consts" // Assuming this exists or I'll use relative if needed
import ReactMarkdown from "react-markdown"
import { toast } from "sonner"

interface Message {
    role: "user" | "model"
    content: string
}

interface AIChatTabProps {
    slug: string
    domain: string
    contextData?: string
    onSaveToNotes: (content: string) => void
}

export default function AIChatTab({ slug, domain, contextData, onSaveToNotes }: AIChatTabProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, loading])

    const handleSend = async () => {
        if (!input.trim()) return

        const newMessage: Message = { role: "user", content: input }
        setMessages(prev => [...prev, newMessage])
        setInput("")
        setLoading(true)

        try {
            // Include context in the first message or a separate field
            // The backend expects: { messages, context }
            // We send the entire history
            const history = [...messages, newMessage]

            // Construct context string based on slug/domain and extra page data
            const contextString = `Page: ${slug}, Section: ${domain}\n\nPage Content Context:\n${contextData || "No specific page context"}`

            const res = await fetch(`${apiEntryPoint}/p/api/v1/ai/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Authorization header is usually handled by a wrapper or interceptor, 
                    // but if this is raw fetch, we might need to handle it. 
                    // Assuming cookies are used or global fetch wrapper logic. 
                    // Based on previous code, credentials: true is likely needed if using raw fetch.
                },
                body: JSON.stringify({
                    messages: history,
                    context: contextString
                }),
                credentials: "include" // Important for cookies
            })

            const data = await res.json()

            if (res.status === 401 || res.status === 403) {
                toast.error("Please login to use AI Assistant", {
                    action: {
                        label: "Login",
                        onClick: () => window.location.href = "/login"
                    }
                })
                setMessages(prev => [...prev, { role: "model", content: "Please **[login](/login)** to continue chatting with the AI." }])
                return
            }

            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch response")
            }

            setMessages(prev => [...prev, { role: "model", content: data.response }])
        } catch (error) {
            console.error("Chat error:", error)
            toast.error("Failed to get response from AI")
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 p-4 pr-0">
                <div className="space-y-4 pr-4">
                    {messages.length === 0 && (
                        <div className="text-center text-muted-foreground mt-10">
                            <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Ask me anything about this topic!</p>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                        >
                            <Avatar className="w-8 h-8 mt-1">
                                <AvatarFallback className={msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}>
                                    {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                                </AvatarFallback>
                            </Avatar>

                            <div className={`group flex flex-col max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                                <div className={`rounded-lg p-3 text-sm ${msg.role === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-foreground"
                                    }`}>
                                    <div className="prose dark:prose-invert text-sm break-words">
                                        <ReactMarkdown>
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>

                                {msg.role === "model" && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 mt-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => onSaveToNotes(msg.content)}
                                    >
                                        <Save className="w-3 h-3 mr-1" />
                                        Save to Notes
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex gap-3">
                            <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-muted"><Bot size={14} /></AvatarFallback>
                            </Avatar>
                            <div className="bg-muted rounded-lg p-3">
                                <Loader2 className="w-4 h-4 animate-spin" />
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            <div className="p-4 border-t mt-auto">
                <div className="flex gap-2">
                    <Input
                        placeholder="Type your question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                    />
                    <Button onClick={handleSend} disabled={loading || !input.trim()} size="icon">
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
