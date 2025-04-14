"use client"

import { useState } from "react"
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
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { handlePostMethod } from "@/utils/apiCall"
import { Textarea } from "@/components/ui/textarea"
import { checkAuthorization } from "@/utils/authorization"
import { useAppDispatch } from "@/redux/store"
import { useRouter } from "next/navigation"
import { addAptiQuestionTagEndpoint } from "@/consts"

const formSchema = z.object({
    type: z.enum(["topic", "category", "company"], {
        required_error: "Please select a tag type",
    }),
    value: z.string().min(1, "Value is required"),
    summary: z.string().min(10, "Summary is required").max(50, "Summary is too long. It should be under 50 characters"),
})

const tagTypes = [
    { value: "topic", label: "Topic" },
    { value: "category", label: "Category" },
    { value: "company", label: "Company" },
]

export default function QuestionTagCreationPage() {
    const [loading, setLoading] = useState(false)
    const dispatch = useAppDispatch();
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: "topic",
            value: "",
            summary: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true)
        try {
            const response = await handlePostMethod(addAptiQuestionTagEndpoint, values)
            if (response instanceof Response) {
                await checkAuthorization(response, dispatch, router, true);
                const data = await response.json()
                alert(data.message)
            } else {
                alert("Error creating")
            }
        } catch (error) {
            console.error('Error creating question tag:', error)
            alert("Error creating")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Question Tag</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tag Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a tag type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {tagTypes.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tag Value</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter tag value" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="summary"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Summary</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Enter summary" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" disabled={loading}>
                                {loading ? "Creating..." : "Create Question Tag"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}