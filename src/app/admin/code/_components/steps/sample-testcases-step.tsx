"use client"

import { type UseFormReturn, useFieldArray } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Minus } from "lucide-react"
import type { FormValues } from "../form-schema"

interface SampleTestCasesStepProps {
    form: UseFormReturn<FormValues>
}

export default function SampleTestCasesStep({ form }: SampleTestCasesStepProps) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "sampleTestCases",
    })

    return (
        <div className="space-y-4">
            <FormLabel>Sample Test Cases</FormLabel>
            <FormField
                name="testCaseVariableNames"
                control={form.control}
                render={({ field }) => (
                    <FormItem className="flex-1">
                        <FormLabel>Variable Names and Types</FormLabel>
                        <FormControl>
                            <Textarea
                                {...field}
                                placeholder={`Variable names and type
Example: x array string
y number`}
                            />
                        </FormControl>
                        <Button
                            type="button"
                            variant="link"
                            size="sm"
                            className="mt-1 text-blue-500"
                            onClick={() =>
                                alert(
                                    'Example:\nx = [1,2,4]\ny = "hello"\noutput:7\nthen:\nx array number\ny string\ninput:\n2\n3\n1 2 4\n1\nhello\noutput:\n7',
                                )
                            }
                        >
                            Show Example
                        </Button>
                        <FormMessage />
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
                                <FormLabel>Input {index + 1}</FormLabel>
                                <FormControl>
                                    <Textarea {...field} placeholder="Input" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`sampleTestCases.${index}.output`}
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Output {index + 1}</FormLabel>
                                <FormControl>
                                    <Textarea {...field} placeholder="Output" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex items-end mb-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => remove(index)}
                            disabled={fields.length <= 1}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}
            <small>Add at least 2 and max 4 as sample test cases</small>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ input: "", output: "" })}>
                <Plus className="h-4 w-4 mr-2" /> Add Test Case
            </Button>
        </div>
    )
}

