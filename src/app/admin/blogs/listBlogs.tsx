'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit2, Trash2, Eye, Plus } from "lucide-react"
import Link from "next/link"
import { handleGetMethod, handleDeleteMethod } from "@/utils/apiCall"
import { getAdminBlogsEndpoint, deleteBlogEndpoint } from "@/consts"
import { useAppSelector } from "@/redux/store"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { BlogPost } from './[slug]/page'


// Ensure the page is wrapped with ReduxProvider if user selector is needed
// However, ReduxProvider is usually at root layout or nearby. 
// Assuming Redux is available. If not, this might need a wrapper.

export default function AdminBlogsPage() {
    const [blogs, setBlogs] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'mine'>('all')
    const user = useAppSelector(state => state.user)

    const fetchBlogs = async () => {
        setLoading(true)
        try {
            let url = `${getAdminBlogsEndpoint}?limit=100`
            if (filter === 'mine' && user.username) {
                url += `&author=${user.username}`
            }

            const response = await handleGetMethod(url)
            if (response instanceof Response && response.ok) {
                const data = await response.json()
                setBlogs(data.data)
            } else {
                toast.error("Failed to fetch blogs")
            }
        } catch (error) {
            console.error(error)
            toast.error("Error fetching blogs")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user.username || filter === 'all') {
            fetchBlogs()
        }
    }, [filter, user.username])

    const handleDelete = async (slug: string) => {
        try {
            const response = await handleDeleteMethod(`${deleteBlogEndpoint}/${slug}`)
            if (response instanceof Response && response.ok) {
                toast.success("Blog deleted successfully")
                fetchBlogs() // Refresh list
            } else {
                toast.error("Failed to delete blog")
            }
        } catch (error) {
            console.error(error)
            toast.error("Error deleting blog")
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Blog Management</h1>
                    <p className="text-zinc-400">Manage all blog posts and tutorials</p>
                </div>
                <Link href="/admin/blogs/add-blog">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-text">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Blog
                    </Button>
                </Link>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="border-b border-zinc-800 pb-4">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl text-white">Posts</CardTitle>
                        <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'mine')}>
                            <TabsList className="bg-zinc-800">
                                <TabsTrigger value="all">All Blogs</TabsTrigger>
                                <TabsTrigger value="mine">My Blogs</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                                <TableHead className="text-zinc-400">Title</TableHead>
                                <TableHead className="text-zinc-400">Author</TableHead>
                                <TableHead className="text-zinc-400">Category</TableHead>
                                <TableHead className="text-zinc-400">Status</TableHead>
                                <TableHead className="text-zinc-400">Date</TableHead>
                                <TableHead className="text-right text-zinc-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i} className="border-zinc-800">
                                        <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-24 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : blogs.length === 0 ? (
                                <TableRow className="border-zinc-800">
                                    <TableCell colSpan={6} className="text-center py-8 text-zinc-500">
                                        No blogs found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                blogs.map((blog) => (
                                    <TableRow key={blog._id} className="border-zinc-800 hover:bg-zinc-800/50">
                                        <TableCell className="font-medium text-zinc-200">
                                            <div className="flex flex-col">
                                                <span>{blog.title}</span>
                                                <span className="text-xs text-zinc-500 truncate max-w-[200px]">{blog.slug}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-zinc-300">{blog.author}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                                                {blog.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={blog.status === 'published'
                                                    ? 'bg-green-900/30 text-green-400 hover:bg-green-900/40'
                                                    : 'bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/40'}
                                            >
                                                {blog.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-zinc-400 text-sm">
                                            {formatDate(blog.createdAt)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/blogs/${blog.slug}`} target="_blank">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/admin/blogs/${blog.slug}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20">
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                </Link>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription className="text-zinc-400">
                                                                This action cannot be undone. This will permanently delete the blog post
                                                                &quot;{blog.title}&quot;.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(blog.slug)}
                                                                className="bg-red-600 hover:bg-red-500 text-white"
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
