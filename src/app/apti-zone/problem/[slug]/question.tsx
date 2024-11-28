"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { getAptiQuestionBySlug } from "../../apicalls"
import { Problem } from "../../commonInterface"
import Link from "next/link"

interface IQuestionData extends Problem {
    description: string
    answers: number[]
    topics: string[]
    categories: string[]
    companies: string[]
    options: string[]
}

export default function AptitudeQuestionPage({ slug }: Readonly<{ slug: string }>) {
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [attemptCount, setAttemptCount] = useState(0)
    const [showAnswer, setShowAnswer] = useState(false)
    const [question, setQuestion] = useState<IQuestionData>()
    const [previousQuestionSlug, setPreviousQuestionSlug] = useState<string>('')
    const [nextQuestionSlug, setNextQuestionSlug] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    useEffect(() => {
        setLoading(true);
        setError("");
        (async () => {
            const response = await getAptiQuestionBySlug(slug)
            setQuestion(response.question)
            setPreviousQuestionSlug(response.prevQuestionSlug)
            setNextQuestionSlug(response.nextQuestionSlug)
        })()
            .catch(e => setError("Failed to load question. Please try again." + e))
            .finally(() => setLoading(false))
    }, [getAptiQuestionBySlug, slug])

    const handleAnswerChange = (answerIndexString: string) => {
        const answerIndex = Number(answerIndexString) + 1
        if (question?.type === "MCQ") {
            setSelectedAnswers([answerIndex])
        } else {
            setSelectedAnswers(prev =>
                prev.includes(answerIndex)
                    ? prev.filter(id => id !== answerIndex)
                    : [...prev, answerIndex]
            )
        }
    }

    const handleSubmit = () => {
        if (selectedAnswers.length > 0) {
            setIsSubmitted(true)
            setAttemptCount(attemptCount + 1)
        }
    }

    const handleShowAnswer = () => {
        if (attemptCount > 0) {
            setShowAnswer(true)
        }
    }

    const isCorrect = (JSON.stringify(selectedAnswers.sort()) === JSON.stringify(question?.answers.sort()))
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">Loading...</div>
        )
    } else if (error) {
        return (
            <div className="h-screen flex items-center justify-center text-red-600">{error}</div>
        )
    }
    return (
        <div className="container mx-auto py-10 flex justify-around items-center">
            {previousQuestionSlug &&
                <Link href={`${previousQuestionSlug}`}
                    className={`text-neutral-500 hover:text-neutral-200`}
                >
                    <ChevronLeft size={60} />
                </Link>
            }
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">
                        Question {question?.questionNo}: {question?.title}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {question?.companies.map(company => (
                            <Badge key={company} variant="secondary">{company}</Badge>
                        ))}
                        {question?.categories.map(category => (
                            <Badge key={category} variant="outline">{category}</Badge>
                        ))}
                        {question?.topics.map(topic => (
                            <Badge key={topic}>{topic}</Badge>
                        ))}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-lg">{question?.description}</p>
                    {question?.type === "MCQ" ? (
                        <RadioGroup
                            onValueChange={(value) => handleAnswerChange(value)}
                            disabled={isSubmitted}
                        >
                            {question?.options.map((option, index) => (
                                <div key={option} className="flex items-center space-x-2">
                                    <RadioGroupItem value={`${index}`} id={option} />
                                    <Label htmlFor={option}>{option}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    ) : (
                        <div className="space-y-2">
                            {question?.options.map((option, index) => (
                                <div key={option} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={option}
                                        checked={selectedAnswers.includes(index + 1)}
                                        onCheckedChange={() => handleAnswerChange(index.toString())}
                                        disabled={isSubmitted}
                                    />
                                    <Label htmlFor={option}>{option}</Label>
                                </div>
                            ))}
                        </div>
                    )}
                    {isSubmitted && (
                        <Alert variant={isCorrect ? "default" : "destructive"}>
                            <AlertTitle className="flex items-center">
                                {isCorrect ? (
                                    <>
                                        <CheckCircle2 className="mr-2 text-green-600" />
                                        <div className="text-green-600">Correct !</div>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="mr-2" />
                                        Incorrect
                                    </>
                                )}
                            </AlertTitle>
                            <AlertDescription>
                                {isCorrect
                                    ? "Great job! You've selected the right answer(s)."
                                    : "Sorry, that's not the correct answer. Try again or view the correct answer."}
                            </AlertDescription>
                        </Alert>
                    )}
                    {showAnswer && (
                        <Alert>
                            <AlertTitle>Correct Answer</AlertTitle>
                            <AlertDescription>
                                <div className="flex gap-2">
                                    <div>The correct answer(s) is/are: </div>
                                    <div>
                                        {question?.answers.map(ans =>
                                            question.options.find((opt, index) => index + 1 === ans)
                                        ).join(", ")}
                                    </div>
                                </div>
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <div className="space-x-2">
                        <Button onClick={handleSubmit} disabled={selectedAnswers.length === 0 || isSubmitted}>
                            Submit Answer
                        </Button>
                        <Button onClick={handleShowAnswer} disabled={attemptCount === 0 || showAnswer} variant="secondary">
                            Show Answer
                        </Button>
                    </div>
                </CardFooter>
            </Card>
            {nextQuestionSlug &&
                <Link href={`${nextQuestionSlug}`}
                    className={`text-neutral-500 hover:text-neutral-200`}
                >
                    <ChevronRight size={60} />
                </Link>
            }
        </div>
    )
}