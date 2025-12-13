"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { handlePostMethod } from "@/utils/apiCall"
import { useAppDispatch } from "@/redux/store"
import { checkAuthorization } from "@/utils/authorization"
import { useRouter } from "next/navigation"
import { createBlogEndpoint, updateBlogEndpoint } from "@/consts"
import { handlePutMethod } from "@/utils/apiCall"
import RichTextEditor from "@/components/RichTextEditor"
import { X, Save, Eye, Loader2 } from "lucide-react"

const formSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title too long"),
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
    author: z.string().min(1, "Author is required"),
    category: z.enum(["Tutorial", "Guide"]),
    tags: z.array(z.string()),
    featured: z.boolean(),
    content: z.string().min(1, "Content is required"),
    status: z.enum(["draft", "published"]),
})

type FormValues = z.infer<typeof formSchema>

interface BlogPost {
    _id: string
    slug: string
    title: string
    author: string
    category: "Tutorial" | "Guide"
    tags: string[]
    featured: boolean
    content: string
    status: "draft" | "published"
}

interface BlogEditorProps {
    initialData?: BlogPost
    isEditMode?: boolean
}

export default function BlogEditor({ initialData, isEditMode = false }: BlogEditorProps) {
    const [loading, setLoading] = useState(false)
    const [tagInput, setTagInput] = useState("")
    const dispatch = useAppDispatch()
    const router = useRouter()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || "",
            slug: initialData?.slug || "",
            author: initialData?.author || "",
            category: initialData?.category || "Tutorial",
            tags: initialData?.tags || [],
            featured: initialData?.featured || false,
            content: initialData?.content || "",
            status: initialData?.status || "draft",
        },
    })

    // Auto-generate slug from title (only in create mode or if slug is empty)
    const title = form.watch("title")
    useEffect(() => {
        if (!isEditMode && title && !form.getValues("slug")) {
            const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            form.setValue("slug", slug)
        }
    }, [title, form, isEditMode])

    const handleAddTag = () => {
        if (tagInput.trim()) {
            const currentTags = form.getValues("tags")
            if (!currentTags.includes(tagInput.trim())) {
                form.setValue("tags", [...currentTags, tagInput.trim()])
            }
            setTagInput("")
        }
    }

    const handleRemoveTag = (tagToRemove: string) => {
        const currentTags = form.getValues("tags")
        form.setValue("tags", currentTags.filter(tag => tag !== tagToRemove))
    }

    const onSubmit = async (values: FormValues, publishImmediately = false) => {
        setLoading(true)
        try {
            const submitData = {
                ...values,
                status: publishImmediately ? "published" : values.status,
            }

            let response;
            if (isEditMode && initialData) {
                // Update existing blog
                // If slug changed, we need to send newSlug in body? Backend logic says:
                // const { slug } = req.params; const { ..., newSlug } = req.body
                // So if we change slug, we send it as newSlug? 
                // Wait, backend updateBlog: if (newSlug && newSlug !== slug) ...

                const updateData: Partial<FormValues> & { newSlug?: string } = { ...submitData }
                if (updateData.slug !== initialData.slug) {
                    updateData.newSlug = updateData.slug
                    // The URL slug is the OLD slug
                }

                response = await handlePutMethod(`${updateBlogEndpoint}/${initialData.slug}`, updateData)
            } else {
                // Create new blog
                response = await handlePostMethod(createBlogEndpoint, submitData)
            }

            if (response instanceof Response) {
                await checkAuthorization(response, dispatch, router, true)
                const res = await response.json()
                if (response.status === 200 || response.status === 201) {
                    alert(isEditMode ? "Blog updated successfully!" : "Blog created successfully!")
                    router.push("/admin/blogs")
                } else {
                    alert(res.message || "Error saving blog")
                }
            } else {
                alert("Server error")
            }
        } catch (error) {
            console.error(error)
            alert("Error saving blog")
        }
        setLoading(false)
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">{isEditMode ? "Edit Blog" : "Create New Blog"}</CardTitle>
                    <CardDescription>
                        {isEditMode ? "Update your blog post details" : "Create a new tutorial or guide for your users"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit((values) => onSubmit(values))} className="space-y-6">

                            {/* Title */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter blog title..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Slug */}
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>URL Slug</FormLabel>
                                        <FormControl>
                                            <Input placeholder="url-friendly-slug" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This will be part of the blog URL: /blogs/{field.value || "slug"}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Author */}
                                <FormField
                                    control={form.control}
                                    name="author"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Author</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Author name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Category */}
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Tutorial">Tutorial</SelectItem>
                                                    <SelectItem value="Guide">Guide</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Tags */}
                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tags</FormLabel>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Add a tag..."
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault()
                                                        handleAddTag()
                                                    }
                                                }}
                                            />
                                            <Button type="button" variant="outline" onClick={handleAddTag}>
                                                Add
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {field.value.map((tag) => (
                                                <Badge key={tag} variant="secondary" className="gap-1">
                                                    {tag}
                                                    <X
                                                        className="w-3 h-3 cursor-pointer"
                                                        onClick={() => handleRemoveTag(tag)}
                                                    />
                                                </Badge>
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Featured Toggle */}
                            <FormField
                                control={form.control}
                                name="featured"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Featured Post</FormLabel>
                                            <FormDescription>
                                                Featured posts appear prominently on the blog listing
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Content - Rich Text Editor */}
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <RichTextEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Write your blog content here..."
                                                className="min-h-[400px]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={loading}
                                    onClick={() => form.handleSubmit((values) => onSubmit(values, false))()}
                                >
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Save as Draft
                                </Button>
                                <Button
                                    type="button"
                                    disabled={loading}
                                    onClick={() => form.handleSubmit((values) => onSubmit(values, true))()}
                                >
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
                                    Publish Now
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
