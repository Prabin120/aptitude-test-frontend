"use client"

import { useState, useEffect } from "react"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { Loader2, Save } from "lucide-react"
import { apiEntryPoint } from "@/consts"
import { toast } from "sonner"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

interface NotesTabProps {
    slug: string
    domain: string
    externalUpdate: string | null // To receive content from Chat
    onUpdateConsumed: () => void // Reset external update
}

export default function NotesTab({ slug, domain, externalUpdate, onUpdateConsumed }: NotesTabProps) {
    const [content, setContent] = useState("")
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const [isUnauthorized, setIsUnauthorized] = useState(false)
    const queryClient = useQueryClient()

    // Fetch note
    const { isLoading } = useQuery({
        queryKey: ['note', slug],
        queryFn: async () => {
            const res = await fetch(`${apiEntryPoint}/p/api/v1/notes/${slug}`, { credentials: "include" })
            if (res.status === 404) return { content: "" }
            if (res.status === 401) {
                setIsUnauthorized(true)
                throw new Error("UNAUTHORIZED")
            }
            if (!res.ok) throw new Error("Failed to fetch note")
            const data = await res.json()
            setContent(data.content || "")
            if (data.updatedAt) setLastSaved(new Date(data.updatedAt))
            return data
        },
        retry: false,
    })

    // Mutation for saving
    const mutation = useMutation({
        mutationFn: async (newContent: string) => {
            const body = {
                slug,
                domain,
                content: newContent,
                location: window.location.pathname
            }

            let res = await fetch(`${apiEntryPoint}/p/api/v1/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                credentials: "include"
            })

            // If note exists, update it instead
            if (res.status === 409) {
                res = await fetch(`${apiEntryPoint}/p/api/v1/notes/${slug}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                    credentials: "include"
                })
            }

            if (!res.ok) throw new Error("Failed to save")
            return res.json()
        },
        onSuccess: () => {
            setLastSaved(new Date())
            toast.success("Note saved")
            queryClient.invalidateQueries({ queryKey: ['note', slug] })
        },
        onError: (error: Error) => {
            if (error.message !== "UNAUTHORIZED") {
                toast.error("Failed to save note")
            }
        }
    })

    // Handle external updates (e.g. from Chat)
    useEffect(() => {
        if (externalUpdate) {
            setContent(prev => prev + (prev ? "\n\n" : "") + externalUpdate)
            onUpdateConsumed()
            toast.success("Added to notes")
        }
    }, [externalUpdate, onUpdateConsumed])

    const handleSave = () => {
        if (isUnauthorized) {
            toast.error("Please login to save notes")
            return
        }
        mutation.mutate(content)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault()
            handleSave()
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (isUnauthorized) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center space-y-4">
                <p className="text-muted-foreground">Please login to view and edit your notes.</p>
                <Button onClick={() => window.location.href = "/login"}>Login</Button>
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
                <Button size="sm" onClick={handleSave} disabled={mutation.isPending}>
                    {mutation.isPending ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Save className="w-3 h-3 mr-2" />}
                    Save Note
                </Button>
            </div>
        </div>
    )
}

