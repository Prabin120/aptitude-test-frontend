"use client"

import { useEffect, useState } from "react"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { handleGetMethod, handlePostMethod } from "@/utils/apiCall"
import { useAppDispatch } from "@/redux/store"
import { checkAuthorization } from "@/utils/authorization"
import { useRouter } from "next/navigation"
import { addAptiQuestionEndpoint, getAptiQuestionTagEndpoint } from "@/consts"

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    type: z.enum(["MCQ", "MAQ"]),
    options: z.array(z.string()).length(4, "Exactly 4 options are required"),
    answers: z.array(z.number()).min(1, "At least one answer is required"),
    marks: z.number().positive("Marks must be positive"),
    topics: z.array(z.string()).min(1, "At least one topic is required"),
    categories: z.array(z.string()).min(1, "At least one category is required"),
    companies: z.array(z.string()).min(1, "At least one category is required"),
})
const answersFields = [1, 2, 3, 4]

export default function QuestionCreationPage() {
    const [loading, setLoading] = useState(false)
    const [topicFields, setTopicFields] = useState<string[]>([])
    const [categoryFields, setCategoryFields] = useState<string[]>([])
    const [companyFields, setCompanyFields] = useState<string[]>([])
    const dispatch = useAppDispatch();
    const router = useRouter();
    useEffect(() => {
        (async () => {
            const response = await handleGetMethod(getAptiQuestionTagEndpoint)
            if (response instanceof Response) {
                await checkAuthorization(response, dispatch, router, true);
                const res = await response.json()
                if (response.status === 200 || response.status === 201) {
                    const { topics, categories, companies } = res
                    const topic_arr = topics.map((d: { _id: string, value: string }) => d.value)
                    const category_arr = categories.map((d: { _id: string, value: string }) => d.value)
                    const comapany_arr = companies.map((d: { _id: string, value: string }) => d.value)
                    setTopicFields(topic_arr)
                    setCategoryFields(category_arr)
                    setCompanyFields(comapany_arr)
                } else {
                    alert("Error fetching question tags")
                }
            } else {
                alert("Error fetching question tags")
            }
        })()
    }, [dispatch, router])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            type: "MCQ",
            options: ["", "", "", ""],
            answers: [],
            marks: 1,
            topics: [],
            categories: [],
            companies: [],
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true)
        try {
            const response = await handlePostMethod(addAptiQuestionEndpoint, values)
            if (response instanceof Response) {
                await checkAuthorization(response, dispatch, router, true);
                const res = await response.json()
                if (response.status === 200 || response.status === 201) {
                    alert("Question added successfully")
                }
                else {
                    alert(res.message)
                }
            } else {
                alert("Server error")
            }
        } catch (error) {
            console.log(error);
            alert(error)
        }
        setLoading(false)
    }

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Question</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                            {/* Title */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Description */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Desciption</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Question Type */}
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Question Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select question type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="MCQ">Multiple Choice Question (MCQ)</SelectItem>
                                                <SelectItem value="MAQ">Multiple Answer Question (MAQ)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Options */}
                            {form.watch("options").map((_, index) => (
                                <FormField
                                    key={index}
                                    control={form.control}
                                    name={`options.${index}`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{`Option ${index + 1}`}</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}

                            {/* Answers */}
                            <FormField
                                control={form.control}
                                name="answers"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Answers</FormLabel>
                                        {answersFields.map((answer) => (
                                            <div key={answer} className="flex items-center space-x-3">
                                                <Checkbox
                                                    checked={field.value.includes(answer)}
                                                    onCheckedChange={(checked) =>
                                                        checked
                                                            ? field.onChange([...field.value, answer])
                                                            : field.onChange(field.value.filter((t) => t !== answer))
                                                    }
                                                />
                                                <FormLabel>{answer}</FormLabel>
                                            </div>
                                        ))}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Topics */}
                            <FormField
                                control={form.control}
                                name="topics"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Topics</FormLabel>
                                        {topicFields.map((topic) => (
                                            <div key={topic} className="flex items-center space-x-3">
                                                <Checkbox
                                                    checked={field.value.includes(topic)}
                                                    onCheckedChange={(checked) =>
                                                        checked
                                                            ? field.onChange([...field.value, topic])
                                                            : field.onChange(field.value.filter((t) => t !== topic))
                                                    }
                                                />
                                                <FormLabel>{topic}</FormLabel>
                                            </div>
                                        ))}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Categories */}
                            <FormField
                                control={form.control}
                                name="categories"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Categories</FormLabel>
                                        {categoryFields.map((category) => (
                                            <div key={category} className="flex items-center space-x-3">
                                                <Checkbox
                                                    checked={field.value.includes(category)}
                                                    onCheckedChange={(checked) =>
                                                        checked
                                                            ? field.onChange([...field.value, category])
                                                            : field.onChange(field.value.filter((c) => c !== category))
                                                    }
                                                />
                                                <FormLabel>{category}</FormLabel>
                                            </div>
                                        ))}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Companies */}
                            <FormField
                                control={form.control}
                                name="companies"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Companies</FormLabel>
                                        {companyFields.map((company) => (
                                            <div key={company} className="flex items-center space-x-3">
                                                <Checkbox
                                                    checked={field.value.includes(company)}
                                                    onCheckedChange={(checked) =>
                                                        checked
                                                            ? field.onChange([...field.value, company])
                                                            : field.onChange(field.value.filter((c) => c !== company))
                                                    }
                                                />
                                                <FormLabel>{company}</FormLabel>
                                            </div>
                                        ))}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Marks */}
                            <FormField
                                control={form.control}
                                name="marks"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Marks</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <Button type="submit" disabled={loading}>
                                {loading ? "Creating..." : "Create Question"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
