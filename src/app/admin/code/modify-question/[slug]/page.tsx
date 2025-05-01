"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import ReduxProvider from "@/redux/redux-provider"
import CircleLoading from "@/components/ui/circleLoading"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FormValues } from "../../_components/form-schema"
import FormContainer from "../../_components/form-container"
import { Toaster } from "sonner"
import { getQuestionDescription } from "@/utils/cloudinary"
import { getOwnedQuestionBySlug } from "../../apiCalls"
import { withCreatorAccess } from "@/components/withCreatorAccess"

function EditQuestion() {
    const params = useParams()
    const router = useRouter()
    const [question, setQuestion] = useState<Partial<FormValues> | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const questionSlug = params.slug as string

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                setLoading(true)
                const [data, description] = await Promise.all([getOwnedQuestionBySlug(questionSlug), getQuestionDescription(questionSlug)])
                data.description = description
                // Convert test cases arrays to JSON strings for the form
                data.simpleTestCases = JSON.stringify(data.simpleTestCases ?? [])
                data.mediumTestCases = JSON.stringify(data.mediumTestCases ?? [])
                data.largeTestCases = JSON.stringify(data.largeTestCases ?? [])
                console.log(data.simpleTestCases, data.mediumTestCases, data.largeTestCases)
                setQuestion(data)
                setError(null)
            } catch (err) {
                console.error("Error fetching question:", err)
                setError("Failed to load question. Please try again.")
            } finally {
                setLoading(false)
            }
        }

        if (questionSlug) {
            fetchQuestion()
        }
    }, [questionSlug])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <CircleLoading color="bg-primary" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="container my-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <div className="mt-4 flex justify-center">
                    <Button onClick={() => router.push("/questions")}>Back to Questions</Button>
                </div>
            </div>
        )
    }

    if (!question) {
        return (
            <div className="container my-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Not Found</AlertTitle>
                    <AlertDescription>The requested question could not be found.</AlertDescription>
                </Alert>
                <div className="mt-4 flex justify-center">
                    <Button onClick={() => router.push("/questions")}>Back to Questions</Button>
                </div>
            </div>
        )
    }

    return (
        <ReduxProvider>
            <main className="dark">
                <FormContainer mode="edit" questionId={questionSlug} initialData={question} />
                <Toaster />
            </main>
        </ReduxProvider>
    )
}

export default withCreatorAccess(EditQuestion)

