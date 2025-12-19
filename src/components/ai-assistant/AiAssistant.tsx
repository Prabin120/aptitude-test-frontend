"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { MessageSquareText, X, Sparkles, Pencil } from "lucide-react" // Icons
import { Button } from "../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Card } from "../ui/card"
// Assuming Toaster is in layout.tsx as per standard clean code.

import AIChatTab from "./AIChatTab"
import NotesTab from "./NotesTab"

import { useAiContext } from "@/context/AiContext"

interface AiAssistantProps {
    // Optional overrides, otherwise derived from URL
    slug?: string
    domain?: "aptitude" | "coding" | "general"
    enableNotes?: boolean
}

export default function AiAssistant({ slug: propSlug, domain: propDomain, enableNotes = true }: AiAssistantProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("chat")
    const [noteUpdate, setNoteUpdate] = useState<string | null>(null)
    const pathname = usePathname()
    const { contextData } = useAiContext() // Get dynamic context from page

    // Auto-derive context from URL if not provided
    const derivedDomain = pathname.startsWith("/aptitude") ? "aptitude"
        : pathname.startsWith("/coding") ? "coding"
            : "general"

    // Use the full pathname as slug to ensure unique notes per page
    // e.g. "/aptitude/all-questions" -> "aptitude-all-questions"
    const derivedSlug = pathname.replace(/^\//, "").replace(/\//g, "-") || "home"

    const slug = propSlug || derivedSlug
    const domain = propDomain || derivedDomain

    // If on blog pages, maybe disable notes by default? User said "suppose for blog page we don't need notes"
    // We can use the enableNotes prop from parent for that, or hardcode logic here.
    // For now, respect the prop.

    const handleSaveToNotes = (content: string) => {
        if (!enableNotes) return
        setNoteUpdate(content)
        setActiveTab("notes") // Switch to notes tab to show it's added
    }

    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-violet-600 to-indigo-600 hover:scale-105"
                >
                    <Sparkles className="h-6 w-6 text-white animate-pulse" />
                </Button>
            </div>
        )
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Main Panel */}
            <Card className="w-[350px] sm:w-[400px] h-[500px] sm:h-[600px] shadow-2xl flex flex-col overflow-hidden border-t-4 border-t-violet-600 animate-in slide-in-from-bottom-5 fade-in duration-200 bg-background">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b bg-muted/30">
                    <div className="flex items-center gap-2 font-semibold text-sm">
                        <Sparkles className="w-4 h-4 text-violet-600" />
                        AI Assistant
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive" onClick={() => setIsOpen(false)}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                        <div className="px-3 pt-3">
                            <TabsList className="w-full grid grid-cols-2">
                                <TabsTrigger value="chat" className="flex items-center gap-2">
                                    <MessageSquareText className="w-4 h-4" />
                                    Ask AI
                                </TabsTrigger>
                                {enableNotes && (
                                    <TabsTrigger value="notes" className="flex items-center gap-2">
                                        <Pencil className="w-4 h-4" />
                                        My Notes
                                    </TabsTrigger>
                                )}
                            </TabsList>
                        </div>

                        <TabsContent value="chat" className="flex-1 mt-0 h-full overflow-hidden data-[state=inactive]:hidden">
                            <AIChatTab
                                slug={slug}
                                domain={domain}
                                contextData={contextData} // Pass the context data
                                onSaveToNotes={handleSaveToNotes}
                            />
                        </TabsContent>

                        {enableNotes && (
                            <TabsContent value="notes" className="flex-1 mt-0 h-full overflow-hidden data-[state=inactive]:hidden">
                                <NotesTab
                                    slug={slug}
                                    domain={domain}
                                    externalUpdate={noteUpdate}
                                    onUpdateConsumed={() => setNoteUpdate(null)}
                                />
                            </TabsContent>
                        )}
                    </Tabs>
                </div>
            </Card>
        </div>
    )
}
