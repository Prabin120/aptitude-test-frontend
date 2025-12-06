"use client"

import { useState, useEffect } from "react"
import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Check, Copy, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { FormValues } from "../form-schema"

interface TestCasesStepProps {
  form: UseFormReturn<FormValues>
}

export default function TestCasesStep({ form }: TestCasesStepProps) {
  console.log("TestCasesStep rendered", form.getValues())
  const [activeTab, setActiveTab] = useState("simple")
  const [jsonError, setJsonError] = useState<Record<string, string | null>>({
    simple: null,
    medium: null,
    large: null,
  })
  const [jsonValid, setJsonValid] = useState<Record<string, boolean>>({
    simple: false,
    medium: false,
    large: false,
  })
  const [copySuccess, setCopySuccess] = useState<Record<string, boolean>>({
    simple: false,
    medium: false,
    large: false,
  })

  // Helper to validate JSON
  const validateJson = (json: string, field: string): boolean => {
    try {
      const parsed = JSON.parse(json)

      if (!Array.isArray(parsed)) {
        setJsonError({ ...jsonError, [field]: "JSON must be an array" })
        setJsonValid({ ...jsonValid, [field]: false })
        return false
      }

      for (const item of parsed) {
        if (!item.input || !item.output) {
          setJsonError({ ...jsonError, [field]: "Each item must have 'input' and 'output' fields" })
          setJsonValid({ ...jsonValid, [field]: false })
          return false
        }
      }

      setJsonError({ ...jsonError, [field]: null })
      setJsonValid({ ...jsonValid, [field]: true })
      return true
    } catch (e) {
      setJsonError({ ...jsonError, [field]: "Invalid JSON format" })
      setJsonValid({ ...jsonValid, [field]: false })
      return false
    }
  }

  // Validate JSON on component mount and when form values change
  useEffect(() => {
    const fields = ["simpleTestCases", "mediumTestCases", "largeTestCases"]
    const tabMap = { simpleTestCases: "simple", mediumTestCases: "medium", largeTestCases: "large" }

    fields.forEach((fieldName) => {
      const value = form.getValues(fieldName as keyof FormValues)
      if (typeof value === "string") {
        validateJson(value, tabMap[fieldName as keyof typeof tabMap])
      }
    })
  }, [form])

  // Handle JSON format validation on change
  const handleChange = (value: string, field: string) => {
    validateJson(value, field)
  }

  // Copy example to clipboard
  const copyExample = (field: keyof FormValues) => {
    const example = form.getValues()[field]

    const exampleString = typeof example === 'string' ? example : JSON.stringify(example)
    navigator.clipboard.writeText(exampleString).then(() => {
      setCopySuccess({ ...copySuccess, [field]: true })
      setTimeout(() => {
        setCopySuccess({ ...copySuccess, [field]: false })
      }, 2000)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Test Cases</h3>
        <div className="text-sm text-muted-foreground">
          Add test cases in JSON format for different complexity levels
        </div>
      </div>

      <Tabs defaultValue="simple" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="simple">Simple Test Cases</TabsTrigger>
          <TabsTrigger value="medium">Medium Test Cases</TabsTrigger>
          <TabsTrigger value="large">Large Test Cases</TabsTrigger>
        </TabsList>

        {["simple", "medium", "large"].map((level) => {
          const fieldName = `${level}TestCases` as "simpleTestCases" | "mediumTestCases" | "largeTestCases"
          const title = level.charAt(0).toUpperCase() + level.slice(1) + " Test Cases"
          const description = {
            simple: "Basic test cases to verify core functionality",
            medium: "Moderate complexity test cases for edge cases",
            large: "Large test cases to verify time complexity constraints",
          }[level]

          return (
            <TabsContent key={level} value={level} className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {title}
                        {jsonValid[level] && <Check className="h-4 w-4 text-green-500" />}
                        {jsonError[level] && <X className="h-4 w-4 text-red-500" />}
                      </CardTitle>
                      <CardDescription>{description}</CardDescription>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => copyExample(fieldName)}
                      className="flex items-center gap-1"
                    >
                      {copySuccess[level] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copySuccess[level] ? "Copied" : "Copy Example"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name={fieldName}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <textarea
                            {...field}
                            className={`w-full min-h-[300px] p-3 font-mono text-sm border rounded-md bg-background ${jsonError[level] 
                              ? "border-red-500" : 
                              jsonValid[level] ? "border-green-500" : ""}`}
                            placeholder={`Enter ${level} test cases in JSON format`}
                            onChange={(e) => {
                              field.onChange(e.target.value)
                              handleChange(e.target.value, level)
                            }}
                          />
                        </FormControl>
                        {jsonError[level] && (
                          <Alert variant="destructive" className="mt-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{jsonError[level]}</AlertDescription>
                          </Alert>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          )
        })}
      </Tabs>

      <div className="bg-muted p-4 rounded-md">
        <h4 className="font-medium mb-2">JSON Format Example:</h4>
        <pre className="text-xs overflow-auto p-2 bg-background rounded border">
          {`[
  {
    "input": "2\\n5\\n1 8 3 5 7\\n1\\n10\\n",
    "output": "2 4"
  },
  {
    "input": "2\\n6\\n5 1 9 3 6 7\\n1\\n14\\n",
    "output": "0 2"
  }
]`}
        </pre>
        <p className="text-xs mt-2 text-muted-foreground">
          Note: Each test case should have an input and output field. Use \\n for newlines in the input.
        </p>
      </div>
    </div>
  )
}

