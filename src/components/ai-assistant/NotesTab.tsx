"use client"

import { useState, useEffect } from "react"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { Loader2, Save } from "lucide-react"
import { apiEntryPoint } from "@/consts" // Assuming this exists
import { toast } from "sonner"
// import { debounce } from "lodash" // Standard lodash debounce might be needed, or write custom

interface NotesTabProps {
    slug: string
    domain: string
    externalUpdate: string | null // To receive content from Chat
    onUpdateConsumed: () => void // Reset external update
}

export default function NotesTab({ slug, domain, externalUpdate, onUpdateConsumed }: NotesTabProps) {
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)

    // Fetch note on mount
    useEffect(() => {
        const fetchNote = async () => {
            try {
                const res = await fetch(`${apiEntryPoint}/p/api/v1/notes/${slug}`, { credentials: "include" })
                if (res.status === 404) {
                    setContent("") // No note yet
                } else if (res.ok) {
                    const data = await res.json()
                    setContent(data.content)
                    setLastSaved(new Date(data.updatedAt))
                } else if (res.status === 401) {
                    setContent("Please login to view/edit your notes.")
                }
                // ignore other errors for now (e.g. 401 if not logged in, maybe show placeholder)
            } catch (error) {
                console.error("Failed to fetch note", error)
            } finally {
                setLoading(false)
            }
        }
        fetchNote()
    }, [slug])

    // Handle external updates (e.g. from Chat)
    useEffect(() => {
        if (externalUpdate) {
            setContent(prev => prev + (prev ? "\n\n" : "") + externalUpdate)
            onUpdateConsumed()
            toast.success("Added to notes")
        }
    }, [externalUpdate, onUpdateConsumed])

    const saveNote = async () => {
        setSaving(true)
        try {
            const res = await fetch(`${apiEntryPoint}/p/api/v1/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slug,
                    domain,
                    content
                }),
                credentials: "include"
            })

            if (!res.ok) throw new Error("Failed to save")

            setLastSaved(new Date())
            toast.success("Note saved")
        } catch (error) {
            toast.error("Failed to save note")
        } finally {
            setSaving(false)
        }
    }

    // Auto-save logic could go here (using a debounce hook/function)
    // For now, manual save + Ctrl+S
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault()
            saveNote()
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full p-4 space-y-4">
            <div className="flex-1">
                <Textarea
                    className="h-full resize-none font-mono text-sm leading-relaxed min-h-[300px]"
                    placeholder="Write your notes here... (Ctrl+S to save)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                    {lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : "Not saved yet"}
                </span>
                <Button size="sm" onClick={saveNote} disabled={saving}>
                    {saving ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Save className="w-3 h-3 mr-2" />}
                    Save Note
                </Button>
            </div>
        </div>
    )
}
