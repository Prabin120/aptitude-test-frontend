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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, Phone, MapPin } from "lucide-react"
import { handlePostMethod } from "@/utils/apiCall"
import { feedbackEndpoint } from "@/consts"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    subject: z.string().min(5, {
        message: "Subject must be at least 5 characters.",
    }),
    message: z.string().min(10, {
        message: "Message must be at least 10 characters.",
    }),
})

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false)
    const [error, setError] = useState("")
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        try {
            const response = await handlePostMethod(feedbackEndpoint, values)
            if (response instanceof Response) {
                if (response.status === 200 || response.status === 201) {
                    setIsFeedbackSubmitted(true)
                }
                else {
                    const responseData = await response.json()
                    setIsFeedbackSubmitted(false)
                    setError(responseData.message)
                }
            } else {
                setIsFeedbackSubmitted(false)
                setError(response.message)
            }
            toast({
                title: "Feedback sent!",
                description: "Thank you for your feedback. We'll get back to you soon.",
            })
            form.reset()
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                        <CardDescription>
                            Get in touch with us using the following contact details.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <span>prabinsharma120@gmail.com</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <span>+91 93657 27136</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MapPin className="h-5 w-5 text-muted-foreground" />
                                <span>21, 9th cross road, Tavarekere Main Rd, BTM 1st Stage, Bengaluru, Karnataka 560029</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Feedback Form</CardTitle>
                        <CardDescription>
                            We&apos;d love to hear your feedback. Please fill out the form below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="john@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Subject</FormLabel>
                                            <FormControl>
                                                <Input placeholder="What is this regarding?" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Message</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Please provide your feedback here..."
                                                    className="min-h-[100px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {isFeedbackSubmitted ?
                                    <Button type="button" className="w-full" disabled>
                                        {error ?
                                            error
                                            :
                                            <p>Thank you for your feedback &#10084;</p>
                                        }
                                    </Button>
                                    :
                                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                                        {isSubmitting && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        {isSubmitting ? "Sending..." : "Send Feedback"}
                                    </Button>
                                }
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}