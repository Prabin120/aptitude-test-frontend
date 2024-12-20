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
import { Search, CalendarIcon } from 'lucide-react'
import { format, startOfDay } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { createTest, validateQuestion } from "../apiCalls"

const formSchema = z.object({
    title: z.string().min(5, "title must be more than 5 words"),
    description: z.string().min(10, "desctiption of the test must be more than 10 words"),
    apti: z.string(),
    aptiMarks: z.string(),
    coding: z.string(),
    codingMarks: z.string(),
    type: z.enum(["exam", "practice"]),
    testDate: z.date(),
    testTime: z.string().min(1,"Time is required"),
    duration: z.string().min(1, "duration has be there"),
})

export default function TestsPage() {
    const [loading, setLoading] = useState(false)
    const [startTime, setStartTime] = useState("")
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    })
    const [invalidAptiQuestions, setInvalidAptiQuestions] = useState<string[]>([]);
    const [invalidCodingQuestions, setInvalidCodingQuestions] = useState<string[]>([]);
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true)
        try {
            const apti_list = values.apti.split(",").map((id: string) => id.trim());
            const code_list = values.coding.split(",").map((id: string) => id.trim());
            const res = await validateQuestion({apti_list, code_list});
            setInvalidAptiQuestions(res.missingAptiIds);
            setInvalidCodingQuestions(res.missingCodeIds);
            if (!res.valid){
                return
            }
            if(apti_list.length != values.aptiMarks.split(",").length){
                alert("apti questions and marks are not same length")
            }
            if(code_list.length != values.codingMarks.split(",").length){
                alert("Coding questions and marks are not same length")
            }
            const year = values.testDate.getFullYear();
            const month = (values.testDate.getMonth() + 1).toString().padStart(2, '0'); // Ensure two digits for month
            const day = values.testDate.getDate().toString().padStart(2, '0'); // Ensure two digits for day
            const date = `${year}-${month}-${day}`;
            const dateTimeStr = `${date}T${values.testTime}:00`; // Adding seconds for valid ISO string
            const dateTime = new Date(dateTimeStr);
            const response = await createTest({...values, apti_list, code_list, dateTime: dateTime.toISOString()});
            if (response instanceof Response) {
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

    const convertToAMPM = (time: string) => {
        const [hours, minutes] = time.split(':');
        const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
        const convertedHours = (parseInt(hours) % 12) || 12;
        return `${convertedHours}:${minutes} ${ampm}`;
    }

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
                                                <Input {...field} placeholder="Enter description of the Test" />
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
                                    name="testDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) => startOfDay(date) < startOfDay(new Date())}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="testTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Time</FormLabel>
                                            <Input
                                                className="w-full block"
                                                placeholder="HH:MM"
                                                id="start-time"
                                                type="time"
                                                value={field.value}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setStartTime(convertToAMPM(e.target.value));
                                                }}
                                                required
                                            />
                                            {startTime &&
                                                <small className="w-full block text-left">You have choosen: {startTime}</small>
                                            }
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
                                    name="apti"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Aptitude Question (Id separated with comma)</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="1, 12, ..." />
                                            </FormControl>
                                            {invalidAptiQuestions.length > 0 &&
                                                <FormMessage>Invalid Question Ids: {invalidAptiQuestions.toString()}</FormMessage>
                                            }
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="aptiMarks"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Aptitude Questions Marks</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="1, 2, 1,..." />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="coding"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Coding Question (Id separated with comma)</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="1, 12, ..." />
                                            </FormControl>
                                            { invalidCodingQuestions.length > 0 &&
                                                <FormMessage>Invalid Question Ids: {invalidCodingQuestions.toString()}</FormMessage>
                                            }
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="codingMarks"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Coding Questions Marks</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="1, 2, 1,..." />
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