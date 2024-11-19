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
import { Plus, Minus, Search } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { addTestCases, getQuestionById } from "../apiCalls"

const formSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
  ioPairs: z.array(z.object({
    input: z.string().min(1, "Input is required"),
    output: z.string().min(1, "Output is required"),
  })).min(1, "At least one input-output pair is required"),
  approved: z.boolean(),
})


export default function TestCaseSubmissionPage() {
  const [questionTitle, setQuestionTitle] = useState<string | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questionId: "",
      ioPairs: [{ input: "", output: "" }],
      approved: false,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ioPairs",
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
    const response = await addTestCases(values)
    alert(response)
  }

  const searchQuestion = async () => {
    const id = form.getValues("questionId")
    if (!id) return

    setIsSearching(true)
    setSearchError(null)
    setQuestionTitle(null)

    try {
      const question = await getQuestionById(id)
      if (question) {
        setQuestionTitle(question.title)
      } else {
        setSearchError("Question not found")
      }
    } catch (error) {
      setSearchError("Error searching for question")
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Add Test Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex items-end space-x-2">
                <FormField
                  control={form.control}
                  name="questionId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Question ID</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter question ID" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" onClick={searchQuestion} disabled={isSearching}>
                  {isSearching ? (
                    <Search className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="mr-2 h-4 w-4" />
                  )}
                  Search
                </Button>
              </div>

              {questionTitle && (
                <Alert>
                  <AlertTitle className="text-green-500">Question Found</AlertTitle>
                  <AlertDescription>Title: {questionTitle}</AlertDescription>
                </Alert>
              )}

              {searchError && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{searchError}</AlertDescription>
                </Alert>
              )}

              {questionTitle && (
                <>
                  <div>
                    <FormLabel>Input-Output Pairs</FormLabel>
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex space-x-2 mt-2">
                        <FormField
                          control={form.control}
                          name={`ioPairs.${index}.input`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Textarea {...field} placeholder="Input in JSON format" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`ioPairs.${index}.output`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input {...field} placeholder="Output" />
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
                      <Plus className="h-4 w-4 mr-2" /> Add Input-Output Pair
                    </Button>
                  </div>
                  <Button type="submit">Submit Test Cases</Button>
                </>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}