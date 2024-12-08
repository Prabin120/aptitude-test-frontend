"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
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
import { Plus, Minus, Search, CalendarIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { useAppDispatch } from "@/redux/store"
import { useRouter } from "next/navigation"
import { checkAuthorization } from "@/utils/authorization"
import { getQuestionById } from "@/app/code/apiCalls"
import { format, startOfDay } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

const formSchema = z.object({
    title: z.string().min(5, "title must be more than 5 words"),
    description: z.string().min(10, "desctiption of the test must be more than 10 words"),
    aptiQuestions: z.string(),
    codingQuestions: z.string(),
    type: z.enum(["exam", "practice"]),
    testDate: z.date(),
    testTime: z.string().min(1,"Time is required"),
    duration: z.string().min(1, "duration has be there"),
})

export default function TestsPage() {
    const [searchError, setSearchError] = useState<string | null>(null)
    const [isValidate, setIsValidate] = useState(false)
    const [loading, setLoading] = useState(false)
    const [startTime, setStartTime] = useState("")
    const [buttonText, setButtonText] = useState("Submit")
    const dispatch = useAppDispatch()
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true)
        try {
            
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
                                                        {/* {startDate ? format(startDate, "PPP") : <span>Pick a date</span>} */}
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
                                    name="aptiQuestions"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Aptitude Question (Id separated with comma)</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="1, 12, ..." />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="codingQuestions"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Coding Question (Id separated with comma)</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="1, 12, ..." />
                                            </FormControl>
                                            <FormMessage />
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
                                    {buttonText}
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