"use client"

import { useState, useRef, useEffect } from "react"
import { Send, User, Bot, Save, Loader2, RotateCcw, AlertCircle, History, Clock, Settings, Terminal } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { ScrollArea } from "../ui/scroll-area"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { apiEntryPoint } from "@/consts"
import ReactMarkdown from "react-markdown"
import { toast } from "sonner"
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { v4 as uuidv4 } from 'uuid';
import Link from "next/link"

// API Key management for AI Chat
const apticode_gemini_key = "apticode_gemini_key";

const setAIApiKey = (apiKey: string) => {
    localStorage.setItem(apticode_gemini_key, apiKey);
}

const getAIApiKey = () => {
    return localStorage.getItem(apticode_gemini_key);
}

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
    const [input, setInput] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)
    const queryClient = useQueryClient()
    const [conversationId, setConversationId] = useState<string | null>(null)
    const [contextLimitReached, setContextLimitReached] = useState(false)
    const [showConversations, setShowConversations] = useState(false)
    const [showSettingsModal, setShowSettingsModal] = useState(false)
    const [apiKey, setApiKey] = useState("")

    // Fetch conversation threads
    const { data: conversationsData } = useInfiniteQuery({
        queryKey: ['aiConversations'],
        queryFn: async () => {
            const res = await fetch(`${apiEntryPoint}/p/api/v1/ai/conversations`, {
                credentials: 'include'
            });
            if (!res.ok) return { conversations: [] };
            return res.json();
        },
        initialPageParam: 1,
        getNextPageParam: () => undefined,
        enabled: showConversations
    });

    const conversations = conversationsData?.pages[0]?.conversations || [];

    // Initialize conversation ID
    useEffect(() => {
        const storedKey = `ai_chat_cid_${slug}`;
        const storedId = localStorage.getItem(storedKey);
        if (storedId) {
            setConversationId(storedId);
        } else {
            const newId = uuidv4();
            localStorage.setItem(storedKey, newId);
            setConversationId(newId);
        }
        
        // Load API key if available
        const storedApiKey = getAIApiKey();
        if (storedApiKey) {
            setApiKey(storedApiKey);
        }
    }, [slug]);

    const startNewChat = () => {
        const newId = uuidv4();
        const storedKey = `ai_chat_cid_${slug}`;
        localStorage.setItem(storedKey, newId);
        setConversationId(newId);
        setContextLimitReached(false);
        queryClient.invalidateQueries({ queryKey: ['aiChat', slug] });
        queryClient.invalidateQueries({ queryKey: ['aiConversations'] });
        toast.success("Started a new conversation");
    };

    const loadConversation = (convId: string) => {
        const storedKey = `ai_chat_cid_${slug}`;
        localStorage.setItem(storedKey, convId);
        setConversationId(convId);
        setContextLimitReached(false);
        setShowConversations(false);
        queryClient.invalidateQueries({ queryKey: ['aiChat', slug] });
    };

    // Fetch History
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isHistoryLoading
    } = useInfiniteQuery({
        queryKey: ['aiChat', slug, conversationId],
        queryFn: async ({ pageParam = 1 }) => {
            if (!conversationId) return { aiCalls: [] };
            const res = await fetch(`${apiEntryPoint}/p/api/v1/ai/chat?page=${pageParam}&conversationId=${conversationId}`, {
                credentials: 'include'
            });
            if (!res.ok) throw new Error("Failed to fetch history");
            return res.json();
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.aiCalls && lastPage.aiCalls.length < 10) return undefined;
            return allPages.length + 1;
        },
        enabled: !!conversationId
    });

    // Flatten messages from history
    // Backend returns messages in DESC order (newest first), so we need to reverse
    const historyMessages: Message[] = data?.pages.flatMap(page =>
        [...page.aiCalls].reverse().map((call: { prompt: string, response: string }) => [
            { role: "user" as const, content: call.prompt },
            { role: "model" as const, content: call.response }
        ])
    ).flat() || [];

    const displayMessages = historyMessages;


    // Mutation for sending message
    const mutation = useMutation({
        mutationFn: async (newMessageContent: string) => {
            const contextString = `Page: ${slug}, Section: ${domain}\n\nPage Content Context:\n${contextData || "No specific page context"}`

            // Current history for context
            const currentHistory = displayMessages.map(m => ({ role: m.role, content: m.content }));
            const userApiKey = getAIApiKey();
            
            const payload = {
                messages: [...currentHistory, { role: "user", content: newMessageContent }],
                context: contextString,
                conversationId: conversationId,
                apiKey: userApiKey
            };

            const res = await fetch(`${apiEntryPoint}/p/api/v1/ai/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "include"
            });

            const data = await res.json();

            if (res.status === 413) {
                // Context Limit Reached
                throw new Error("CONTEXT_LIMIT");
            }
            if (res.status === 401 || res.status === 403) {
                throw new Error("UNAUTHORIZED");
            }
            if (res.status === 405) {
                // Quota exceeded
                throw new Error("QUOTA_EXCEEDED");
            }
            if (!res.ok) {
                throw new Error(data.message || "Failed to send message");
            }

            return data.response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['aiChat', slug, conversationId] });
            queryClient.invalidateQueries({ queryKey: ['aiConversations'] });
        },
        onError: (error: Error) => {
            if (error.message === "CONTEXT_LIMIT") {
                setContextLimitReached(true);
                toast.error("Conversation limit reached. Please start a new chat.");
            } else if (error.message === "UNAUTHORIZED") {
                toast.error("Please login to use AI Assistant", {
                    action: {
                        label: "Login",
                        onClick: () => window.location.href = "/login"
                    }
                });
            } else if (error.message === "QUOTA_EXCEEDED") {
                setShowSettingsModal(true);
            } else {
                toast.error(error.message);
            }
        }
    });

    const handleSend = () => {
        if (!input.trim()) return;
        const msg = input;
        setInput("");
        mutation.mutate(msg);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Auto-scroll on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [displayMessages.length]);

    // Settings Modal Component
    const SettingsModal = () => (
        <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
            <DialogContent className="max-w-3xl gap-0 p-0 overflow-hidden bg-zinc-950 border-zinc-800 text-zinc-100">
                <div className="grid grid-cols-4 h-[500px]">
                    {/* Sidebar */}
                    <div className="col-span-1 border-r border-zinc-800 bg-zinc-900/50 p-4 space-y-2">
                        <div className="mb-6 px-2">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Settings className="w-5 h-5" />
                                Settings
                            </h2>
                        </div>
                        <button
                            onClick={() => {}}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors bg-zinc-800 text-white font-medium"
                        >
                            <Terminal className="w-4 h-4" />
                            API Key Setup
                        </button>
                    </div>

                    {/* Content */}
                    <div className="col-span-3 p-6 overflow-y-auto">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-medium mb-1">API Key Setup</h3>
                                <p className="text-sm text-zinc-400">Add API key to access AptiCode AI for free.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="api-key" className="text-zinc-300">API Key (Google Gemini)</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="api-key"
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            type="password"
                                            placeholder="AI..."
                                            className="bg-zinc-900 border-zinc-700 focus-visible:ring-primary"
                                        />
                                        <Button 
                                            onClick={() => {
                                                setAIApiKey(apiKey);
                                                toast.success("API Key saved successfully");
                                                setShowSettingsModal(false);
                                            }} 
                                            className="bg-primary hover:bg-primary/90 text-primary-text"
                                        >
                                            Save
                                        </Button>
                                    </div>
                                    <p className="text-xs text-zinc-500">
                                        Your API key is stored locally in your browser. We will not store your API key anywhere. Read our <Link href="/privacy-policy" className="text-primary hover:text-primary/80 underline underline-offset-4">Privacy Policy</Link> for more details.
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-zinc-800">
                                    <h4 className="text-sm font-medium mb-2 text-zinc-300">How to get an API Key?</h4>
                                    <Link
                                        href="/blogs/how-to-use-unlimited-ai-without-premium"
                                        className="text-sm text-primary hover:text-primary/80 underline underline-offset-4"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Get Free API Key &rarr;
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );


    return (
        <div className="flex flex-col h-full relative">
            {/* Settings Modal */}
            <SettingsModal />
            
            <div className="flex justify-between items-center p-2 border-b">
                <div className="flex items-center gap-1">
                    <h3 className="text-sm font-medium">AI Assistant</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => setShowConversations(!showConversations)}
                        title="History"
                    >
                        <History className="w-3.5 h-3.5" />
                    </Button>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={startNewChat} title="Start New Chat">
                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                    New Chat
                </Button>
            </div>

            {showConversations && (
                <div className="absolute inset-0 z-50 bg-background border-r flex flex-col pt-12">
                    <div className="px-4 py-2 border-b flex justify-between items-center bg-muted/50">
                        <span className="text-xs font-semibold uppercase text-muted-foreground">Recent Conversations</span>
                        <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setShowConversations(false)}>
                            Close
                        </Button>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                            {conversations.length === 0 ? (
                                <div className="text-center p-4 text-xs text-muted-foreground">
                                    No previous conversations found.
                                </div>
                            ) : (
                                conversations.map((conv: { _id: string, lastUpdated: string, lastMessage: string, context: string, messageCount: number }) => (
                                    <button
                                        key={conv._id}
                                        onClick={() => loadConversation(conv._id)}
                                        className={`w-full text-left p-3 rounded-md hover:bg-accent transition-colors border border-transparent ${conversationId === conv._id ? 'bg-accent border-accent-foreground/10' : ''}`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium truncate mb-1">
                                                    {conv.lastMessage || "Empty conversation"}
                                                </p>
                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{new Date(conv.lastUpdated).toLocaleDateString()}</span>
                                                    <span className="truncate max-w-[100px] opacity-70">
                                                        {conv.context || "General"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-[10px] font-mono opacity-50">
                                                {conv.messageCount} msg
                                            </div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>
            )}

            <ScrollArea className="flex-1 p-4 pr-0">
                <div className="space-y-4 pr-4">
                    {hasNextPage && (
                        <div className="flex justify-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                className="text-xs text-muted-foreground"
                            >
                                {isFetchingNextPage ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                                Load Older Messages
                            </Button>
                        </div>
                    )}

                    {displayMessages.length === 0 && !isHistoryLoading && (
                        <div className="text-center text-muted-foreground mt-10">
                            <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Ask me anything about this topic!</p>
                        </div>
                    )}

                    {displayMessages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                        >
                            <Avatar className="w-8 h-8 mt-1">
                                <AvatarFallback className={msg.role === "user" ? "bg-primary text-primary-text" : "bg-muted"}>
                                    {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                                </AvatarFallback>
                            </Avatar>

                            <div className={`group flex flex-col max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                                <div className={`rounded-lg p-3 text-sm ${msg.role === "user"
                                    ? "bg-primary text-primary-text"
                                    : "bg-muted text-foreground"
                                    }`}>
                                    <div className="prose dark:prose-invert text-sm break-words whitespace-pre-wrap">
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

                    {/* Optimistic / Loading State for Mutation */}
                    {mutation.isPending && (
                        <div className="flex gap-3">
                            <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-muted"><Bot size={14} /></AvatarFallback>
                            </Avatar>
                            <div className="bg-muted rounded-lg p-3">
                                <Loader2 className="w-4 h-4 animate-spin" />
                            </div>
                        </div>
                    )}

                    {contextLimitReached && (
                        <div className="flex justify-center p-4">
                            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                <span>Conversation limit reached. Please start a new chat.</span>
                                <Button size="sm" variant="outline" className="ml-2 bg-background" onClick={startNewChat}>
                                    Start New
                                </Button>
                            </div>
                        </div>
                    )}

                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            <div className="p-4 border-t mt-auto">
                <div className="flex gap-2">
                    <Input
                        placeholder={contextLimitReached ? "Start a new chat to continue..." : "Type your question..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={mutation.isPending || contextLimitReached}
                    />
                    <Button onClick={handleSend} disabled={mutation.isPending || !input.trim() || contextLimitReached} size="icon">
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
