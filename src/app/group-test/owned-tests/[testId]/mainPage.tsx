"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RefreshCcw, Edit, Save, X, Edit2Icon } from "lucide-react"
import { cn } from "@/lib/utils"
import { handleGetMethod, handlePutMethod } from "@/utils/apiCall"
import {
    getOwnedGroupTestsEndpoint,
    groupTestEditMail,
    groupTestMailStatusEndpoint,
    groupTestResendMails
} from "@/consts"
import { toast } from "sonner"
import { SearchableQuestions } from "@/components/searchQuestion"
import DateAndTime from "@/components/dateAndTime"

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    addParticipants: z.array(z.string().email("Invalid email")).nullish(),
    apti_list: z.array(z.object({ 
        _id: z.string(),
        slug: z.string(),
        title: z.string(),
        marks: z.number() 
    })),
    code_list: z.array(z.object({ 
        _id: z.string(),
        slug: z.string(),
        title: z.string(),
        marks: z.number() 
    })),
    startDateTime: z.date(),
    duration: z.string().min(1, "Duration must be at least 1 minute"),
    totalParticipants: z.number().min(1, "Total participants must be at least 1"),
})

export default function GroupTestDetailPage() {
    const { testId } = useParams()
    const [loading, setLoading] = useState(true)
    const [mailStatus, setMailStatus] = useState<{ email: string; status: string, _id: string }[]>([])
    const [isEditing, setIsEditing] = useState(false)
    const [testData, setTestData] = useState<z.infer<typeof formSchema> | null>(null)
    const [editMail, setEditMail] = useState<{ email: string; status: string, _id: string }>()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: testData || {},
    })

    useEffect(() => {
        (async () => {
            fetchTestData()
            fetchMailStatus()
        })()
    }, [testId])

    useEffect(() => {
    }, [testId])

    useEffect(() => {
        if (testData) {
            form.reset(testData)
        }
    }, [testData, form])

    const fetchTestData = async () => {
        setLoading(true)
        try {
            const response = await handleGetMethod(`${getOwnedGroupTestsEndpoint}/${testId}`)
            if (response instanceof Response && response.ok) {
                const data = await response.json()
                data.groupTest.startDateTime = new Date(data.groupTest.startDateTime)
                setTestData(data.groupTest)
                const mails: { email: string; status: string, _id: string }[] = []
                data.groupTest.participants.forEach((participant: string) => {
                    mails.push({ email: participant, status: "pending", _id: "" })
                })
                setMailStatus(mails)
            }
        } catch (error) {
            console.error("Error fetching test data:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchMailStatus = async () => {
        try {
            const response = await handleGetMethod(groupTestMailStatusEndpoint, `testId=${testId}`)
            if (response instanceof Response && response.ok) {
                const data = await response.json()
                setMailStatus(data.data)
                toast("Mail status refreshed")
            }
        } catch (error) {
            console.error("Error fetching mail status:", error)
        }
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log("values", values);
        try {
            const data: Partial<typeof values> = { 
                ...values,
                apti_list: values.apti_list.map(item => ({
                    _id: item._id,
                    slug: item.slug,
                    title: item.title,
                    marks: item.marks
                })),
                code_list: values.code_list.map(item => ({
                    _id: item._id,
                    slug: item.slug,
                    title: item.title,
                    marks: item.marks
                }))
            }
            delete data.title;
            delete data.totalParticipants;
            if (values.startDateTime.getTime() === testData?.startDateTime.getTime()) {
                delete data.startDateTime
            }
            if (values.duration === testData?.duration) {
                delete data.duration
            }
            if (values.description === testData?.description) {
                delete data.description
            }
            const response = await handlePutMethod(`${getOwnedGroupTestsEndpoint}/${testId}`, data)
            if (response instanceof Response) {
                const data = await response.json()
                if (!response.ok) {
                    alert(data.message)
                    return
                }
                toast("Data updated successfully")
            }
        } catch (error) {
            console.error("Error updating test data:", error)
        } finally {
            setIsEditing(false)
        }
    }

    const handleResendMails = async () => {
        try {
            const response = await handleGetMethod(groupTestResendMails, `testId=${testId}`)
            if (response instanceof Response && response.ok) {
                fetchMailStatus()
            }
        } catch (error) {
            console.error("Error resending mails:", error)
        }
    }

    const handleEditEmail = async (mail: { email: string; status: string, _id: string }) => {
        try {
            const response = await handlePutMethod(groupTestEditMail + "?testId=" + testId, mail)
            if (response instanceof Response) {
                const res = await response.json()
                if (response.ok) {
                    fetchMailStatus()
                    toast("Email updated successfully")
                } else {
                    alert(res.message)
                }
            }
            setEditMail(undefined)
        } catch (error) {
            console.log(error);
            alert("Error editing mail")
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Group Test Details</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <Form {...form}>
                        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    Test Information
                                    {!isEditing ? (
                                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                    ) : (
                                        <div className="space-x-2">
                                            <Button variant="outline" size="sm" type="submit">
                                                <Save className="h-4 w-4 mr-2" />
                                                Save
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                                                <X className="h-4 w-4 mr-2" />
                                                Cancel
                                            </Button>
                                        </div>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} disabled={!isEditing} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="addParticipants"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Add more Participants (Type comma separated Email ID)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    disabled={!isEditing}
                                                    placeholder="Example: v1R9a@example.com, 9V7YB@example.com"
                                                    value={field.value?.join(", ")}
                                                    onChange={(e) => field.onChange(e.target.value.split(",").map((email) => email.trim()))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="startDateTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Date and Time</FormLabel>
                                                <DateAndTime field={field} disableField={!isEditing} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="duration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Duration (minutes)</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={!isEditing} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="apti_list"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Aptitude Questions</FormLabel>
                                            <FormControl>
                                                <SearchableQuestions
                                                    selectedQuestions={field.value}
                                                    onQuestionsChange={field.onChange}
                                                    questionType="aptitude"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="code_list"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Coding Questions</FormLabel>
                                            <FormControl>
                                                <SearchableQuestions
                                                    selectedQuestions={field.value}
                                                    onQuestionsChange={field.onChange}
                                                    questionType="coding"                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="totalParticipants"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Total Participants</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" disabled />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </form>
                    </Form>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            Participant Emails
                            <Button variant="outline" size="sm" onClick={fetchMailStatus}>
                                <RefreshCcw className="h-4 w-4 mr-2" />
                                Refresh
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px] overflow-y-auto space-y-2">
                            {mailStatus.map((mail, index) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-secondary rounded">
                                    <Input
                                        className="w-full h-6 bg-transparent"
                                        disabled={editMail?._id !== mail._id}
                                        value={editMail?._id === mail._id ? editMail.email : mail.email}
                                        onChange={(e) => setEditMail({ email: e.target.value, status: editMail?.status || "pending", _id: editMail?._id || "" })}
                                    />
                                    <div className="flex items-center gap-1">
                                        <span
                                            className={cn(
                                                "text-sm font-medium",
                                                mail.status === "sent" && "text-green-500",
                                                mail.status === "failed" && "text-red-500",
                                            )}
                                        >
                                            {editMail?._id === mail._id ? "" : mail.status}
                                        </span>
                                        {mail.status === "failed" && (
                                            <span className="inline rounded-full flex items-center justify-center">
                                                {editMail?.email ? (
                                                    <Save className="inline h-4 w-4 ml-2 cursor-pointer" onClick={() => handleEditEmail(editMail)} />
                                                ) : (
                                                    <Edit2Icon
                                                        className="inline h-4 w-4 ml-2 cursor-pointer"
                                                        onClick={() => setEditMail(mail)}
                                                    />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button className="w-full mt-4" onClick={handleResendMails}>
                            Resend Failed Emails
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

