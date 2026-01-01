"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    Search,
    Filter,
    Trash2,
    Edit3,
    Eye,
    ExternalLink,
    FileText,
    Loader2,
    Calendar,
} from "lucide-react"
import { apiEntryPoint } from "@/consts"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import ReactMarkdown from "react-markdown"
import Link from "next/link"

interface Note {
    _id: string
    slug: string
    domain: "aptitude" | "coding" | "general"
    content: string
    location?: string
    updatedAt: string
}

export default function NotesPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [domainFilter, setDomainFilter] = useState<string>("all")
    const [editingNote, setEditingNote] = useState<Note | null>(null)
    const [viewingNote, setViewingNote] = useState<Note | null>(null)
    const [editContent, setEditContent] = useState("")
    const queryClient = useQueryClient()

    // Fetch notes
    const { data: notes = [], isLoading } = useQuery<Note[]>({
        queryKey: ['all-notes', domainFilter],
        queryFn: async () => {
            const url = new URL(`${apiEntryPoint}/p/api/v1/notes`)
            if (domainFilter !== "all") {
                url.searchParams.append("domain", domainFilter)
            }
            const res = await fetch(url.toString(), { credentials: "include" })
            if (!res.ok) throw new Error("Failed to fetch notes")
            return res.json()
        }
    })

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (slug: string) => {
            const res = await fetch(`${apiEntryPoint}/p/api/v1/notes/${slug}`, {
                method: "DELETE",
                credentials: "include"
            })
            if (!res.ok) throw new Error("Failed to delete note")
            return res.json()
        },
        onSuccess: () => {
            toast.success("Note deleted")
            queryClient.invalidateQueries({ queryKey: ['all-notes'] })
        }
    })

    // Update Mutation
    const updateMutation = useMutation({
        mutationFn: async ({ slug, content }: { slug: string, content: string }) => {
            const res = await fetch(`${apiEntryPoint}/p/api/v1/notes/${slug}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
                credentials: "include"
            })
            if (!res.ok) throw new Error("Failed to update note")
            return res.json()
        },
        onSuccess: () => {
            toast.success("Note updated")
            setEditingNote(null)
            queryClient.invalidateQueries({ queryKey: ['all-notes'] })
        }
    })

    const filteredNotes = notes.filter(note =>
        note.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleEdit = (note: Note) => {
        setEditingNote(note)
        setEditContent(note.content)
    }

    const handleUpdate = () => {
        if (!editingNote) return
        updateMutation.mutate({ slug: editingNote.slug, content: editContent })
    }

    const getDomainColor = (domain: string) => {
        switch (domain) {
            case "aptitude": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            case "coding": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            default: return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
        }
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        {/* <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Home
                        </Link> */}
                        <h1 className="text-3xl font-bold tracking-tight">My Notes</h1>
                        <p className="text-muted-foreground mt-1">Review and manage all your saved insights and snippets.</p>
                    </div>
                </div>

                {/* Filters */}
                <Card className="mb-8 border-none bg-muted/40 shadow-none">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search in notes..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-muted-foreground hidden sm:block" />
                                <Select value={domainFilter} onValueChange={setDomainFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="All Domains" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Domains</SelectItem>
                                        <SelectItem value="aptitude">Aptitude</SelectItem>
                                        <SelectItem value="coding">Coding</SelectItem>
                                        <SelectItem value="general">General</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notes Grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Loading your notes...</p>
                    </div>
                ) : filteredNotes.length === 0 ? (
                    <div className="text-center py-20 bg-muted/40 rounded-xl border border-dashed">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">No notes found</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                            {searchQuery || domainFilter !== "all"
                                ? "Try adjusting your filters or search terms."
                                : "You haven't saved any notes yet. Start asking AI!"}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNotes.map((note) => (
                            <Card key={note._id} className="flex flex-col group bg-muted/40 hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start gap-2 mb-2">
                                        <Badge variant="secondary" className={`capitalize font-normal text-[10px] ${getDomainColor(note.domain)}`}>
                                            {note.domain}
                                        </Badge>
                                        <div className="flex items-center text-[10px] text-muted-foreground">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {new Date(note.updatedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <CardTitle className="text-md font-semibold truncate" title={note.slug}>
                                        {note.location ? (
                                            <Link href={note.location} className="hover:text-primary transition-colors flex items-center gap-1">
                                                {note.location.replace("%20", " ")}
                                                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                        ) : (
                                            note.slug.replace(/-/g, " ")
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 pb-4">
                                    <div className="text-sm text-foreground/80 line-clamp-4 prose prose-sm dark:prose-invert max-w-full whitespace-pre-wrap">
                                        <ReactMarkdown>{note.content}</ReactMarkdown>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-3 border-t bg-muted/10 justify-between gap-2">
                                    <div className="flex gap-1">
                                        <Button
                                            variant="default"
                                            size="sm"
                                            className="h-8 px-2 rounded-sm"
                                            onClick={() => setViewingNote(note)}
                                        >
                                            <Eye className="w-3.5 h-3.5 mr-1.5" />
                                            View
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-2"
                                            onClick={() => handleEdit(note)}
                                        >
                                            <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => deleteMutation.mutate(note.slug)}
                                            disabled={deleteMutation.isPending}
                                        >
                                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                            Delete
                                        </Button>
                                    </div>
                                    {note.location && (
                                        <Button asChild variant="outline" size="sm" className="h-8 px-2">
                                            <Link href={note.location}>
                                                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                                                Visit
                                            </Link>
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editingNote} onOpenChange={(open) => !open && setEditingNote(null)}>
                <DialogContent className="sm:max-w-[600px] h-[600px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit3 className="w-5 h-5" />
                            Edit Note: {editingNote?.slug.replace(/-/g, " ")}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 py-4">
                        <Textarea
                            className="h-full resize-none font-mono text-sm leading-relaxed"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingNote(null)}>Cancel</Button>
                        <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
                            {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Dialog */}
            <Dialog open={!!viewingNote} onOpenChange={(open) => !open && setViewingNote(null)}>
                <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col">
                    <DialogHeader>
                        <div className="flex items-center justify-between pr-6">
                            <DialogTitle className="flex items-center gap-2 text-xl">
                                <FileText className="w-5 h-5 text-primary" />
                                {viewingNote?.location ? (
                                    <Link href={viewingNote.location} className="hover:text-primary transition-colors flex items-center gap-2">
                                        {viewingNote.slug.replace(/-/g, " ")}
                                        <ExternalLink className="w-4 h-4" />
                                    </Link>
                                ) : (
                                    viewingNote?.slug.replace(/-/g, " ")
                                )}
                            </DialogTitle>
                            {viewingNote?.domain && (
                                <Badge variant="secondary" className={`capitalize font-normal ${getDomainColor(viewingNote.domain)}`}>
                                    {viewingNote.domain}
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {viewingNote?.updatedAt && new Date(viewingNote.updatedAt).toLocaleString()}
                            </span>
                        </div>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto mt-4 pr-2">
                        <div className="prose prose-sm dark:prose-invert max-w-full bg-muted/30 p-6 rounded-lg border border-muted-foreground/10 whitespace-pre-wrap">
                            <ReactMarkdown>{viewingNote?.content || ""}</ReactMarkdown>
                        </div>
                    </div>
                    <DialogFooter className="mt-6 gap-2">
                        {viewingNote?.location && (
                            <Button asChild variant="outline" className="flex-1 sm:flex-none">
                                <Link href={viewingNote.location}>
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Visit Original Page
                                </Link>
                            </Button>
                        )}
                        <Button
                            className="flex-1 sm:flex-none"
                            onClick={() => {
                                if (viewingNote) {
                                    handleEdit(viewingNote)
                                    setViewingNote(null)
                                }
                            }}
                        >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Note
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
