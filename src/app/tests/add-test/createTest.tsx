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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search} from 'lucide-react'
import { createTest } from "../apiCalls"
import { checkAuthorization } from "@/utils/authorization"
import { useAppDispatch } from "@/redux/store"
import { SearchableQuestions } from "@/components/searchQuestion"
import DateAndTime from "@/components/dateAndTime"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
    title: z.string().min(5, "title must be more than 5 words"),
    description: z.string().min(10, "desctiption of the test must be more than 10 words"),
    apti_list: z.array(z.object({ _id: z.string(), slug: z.string(), title: z.string(), marks: z.number() })).optional(),
    code_list: z.array(z.object({ _id: z.string(), slug: z.string(), title: z.string(), marks: z.number() })).optional(),
    type: z.enum(["exam", "practice"]),
    startDateTime: z.date().default(new Date()),
    duration: z.string().min(1, "duration has be there"),
    amount: z.string().optional(),
})

export default function TestsPage() {
    const [loading, setLoading] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    })
    const dispath = useAppDispatch()
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true)
        try {
            const response = await createTest(values);
            if (response instanceof Response) {
                await checkAuthorization(response, dispath);
                const res = await response.json();
                if (response.status === 200 || response.status === 201) {
                    alert("Test set successfully");
                } else {
                    alert(res.message);
                }
            } else{
                alert("Server error")
            }
        } catch (error) {
            console.error("Error submitting test cases:", error);
            alert("An error occurred while submitting test cases. Please try again.");
        } finally {
            setLoading(false)
        }
    }

    // const convertToAMPM = (time: string) => {
    //     const [hours, minutes] = time.split(':');
    //     const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
    //     const convertedHours = (parseInt(hours) % 12) || 12;
    //     return `${convertedHours}:${minutes} ${ampm}`;
    // }

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Add a Test</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="flex flex-col gap-3">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter title of the Test" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} placeholder="Enter description of the Test" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Test Type</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="exam or practice" />
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
                                                <DateAndTime field={field} disablePastDate />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="duration"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Duration of Test (in Minutes)</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="60" />
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
                                                    selectedQuestions={field.value??[]}
                                                    onQuestionsChange={field.onChange}
                                                    questionType="aptitude"
                                                />
                                            </FormControl>
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
                                                    selectedQuestions={field.value??[]}
                                                    onQuestionsChange={field.onChange}
                                                    questionType="coding"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Amount (For exam type amount is required)</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="18" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">
                                    <>
                                    {loading?
                                        <Search className="mr-2 h-4 w-4 animate-spin" />
                                        :
                                        <Search className="mr-2 h-4 w-4" />
                                    }
                                    Submit
                                </>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}