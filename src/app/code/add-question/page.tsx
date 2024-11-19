"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
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
import { Plus, Minus } from "lucide-react"
import { addQuestion } from "../apiCalls"
import CircleLoading from "@/components/ui/circleLoading"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

const languageOptions = ["py", "js", "java", "c", "cpp", "go"]

const defaultCodeTemplates = Object.fromEntries(languageOptions.map(lang => [lang, { precode: "", template: "", postcode: "" }]));

const codeTemplateSchema = z.object({
    precode: z.string().optional(), // Assuming precode can be optional
    template: z.string().optional(), // Assuming template can be optional
    postcode: z.string().optional() // Assuming postcode can be optional
});

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    difficulty: z.enum(["easy", "medium", "hard"]),
    tags: z.string().transform(str => str.split(",").map(tag => tag.trim())),
    sampleTestCases: z.array(z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
    })).min(1, "At least one sample test case is required"),
    codeTemplates: z.record(codeTemplateSchema),
    testCaseVariableNames: z.string(),
    solution: z.string().min(1, "Solution is required"),
    timeLimit: z.number().positive("Time limit must be positive"),
    memoryLimit: z.number().positive("Memory limit must be positive"),
    isPublic: z.boolean(),
})

export default function QuestionSubmissionForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            difficulty: "medium",
            //   tags: "",
            sampleTestCases: [{ input: "", output: "" }],
            codeTemplates: defaultCodeTemplates,
            solution: "",
            testCaseVariableNames: "",
            timeLimit: 1,
            memoryLimit: 2,
            isPublic: true,
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "sampleTestCases",
    })
    const [loading, setLoading] = useState(false);
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true)
        console.log(values)
        try {
            const response = await addQuestion(values)
            alert(response)
        } catch (error) {
            console.error('Error submitting question:', error)
        }
        setLoading(false)
    }

    return (
        <div className="container my-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Submit New Question</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
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
                                            <ReactQuill value={field.value} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="difficulty"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Difficulty</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select difficulty" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="easy">Easy</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="hard">Hard</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tags</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="separated by commas" />
                                        </FormControl>
                                        <FormDescription>Enter tags separated by commas</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div>
                                <FormLabel>Sample Test Cases</FormLabel>
                                <FormField
                                    name={'testCaseVariableNames'}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Textarea {...field} placeholder="Variable names and type
                                                Example: x array string \ny number" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex space-x-2 mt-2">
                                        <FormField
                                            control={form.control}
                                            name={`sampleTestCases.${index}.input`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Textarea {...field} placeholder="Input" />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`sampleTestCases.${index}.output`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Textarea {...field} placeholder="Output" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="button" variant="outline" size="icon" onClick={() => remove(index)}>
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ input: "", output: "" })}>
                                    <Plus className="h-4 w-4 mr-2" /> Add Test Case
                                </Button>
                            </div>

                            <div>
                                <FormLabel>Code Templates</FormLabel>
                                {languageOptions.map((lang) => (
                                    <div key={lang} className="py-4">
                                        <h3>{lang.toUpperCase()}</h3>
                                        {["precode", "template", "postcode"].map((fieldType) => (
                                            <FormField
                                                key={`${lang}-${fieldType}`} // Unique key based on language and field type
                                                control={form.control}
                                                name={`codeTemplates.${lang}.${fieldType}`} // Dynamic field name
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{fieldType.charAt(0).toUpperCase() + fieldType.slice(1)}</FormLabel>
                                                        <FormControl>
                                                            <Textarea {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>

                            <FormField
                                control={form.control}
                                name="solution"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Solution template in CPP</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="timeLimit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Time Limit (seconds)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="memoryLimit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Memory Limit (MB)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isPublic"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Make this question public
                                            </FormLabel>
                                            <FormDescription>
                                                If checked, this question will be visible to all users.
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            {
                                loading ?
                                    <Button type="submit" className="w-full" disabled>
                                        <CircleLoading color="bg-neutral-50" />
                                    </Button>
                                    :
                                    <Button type="submit" className="w-full">
                                        Submit Question
                                    </Button>
                            }
                        </CardContent>
                    </Card>
                </form>
            </Form>
        </div>
    )
}