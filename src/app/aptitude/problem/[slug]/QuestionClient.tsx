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
import { checkAuthorization } from "@/utils/authorization"
import { useAppDispatch } from "@/redux/store"
import { useAiContext } from "@/context/AiContext"

interface IQuestionData extends Problem {
    description: string
    answers: number[]
    topics: string[]
    categories: string[]
    companies: string[]
    options: string[]
}

interface AptitudeQuestionPageProps {
    slug: string
    initialQuestion: IQuestionData | null
    prevSlug: string
    nextSlug: string
}

export default function AptitudeQuestionPage({ slug, initialQuestion, prevSlug, nextSlug }: AptitudeQuestionPageProps) {
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [attemptCount, setAttemptCount] = useState(0)
    const [showAnswer, setShowAnswer] = useState(false)
    const [question, setQuestion] = useState<IQuestionData | undefined>(initialQuestion || undefined)
    const [previousQuestionSlug, setPreviousQuestionSlug] = useState<string>(prevSlug)
    const [nextQuestionSlug, setNextQuestionSlug] = useState<string>(nextSlug)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(initialQuestion ? "" : "Failed to load question.")
    const dispatch = useAppDispatch();
    const { setContextData } = useAiContext();

    useEffect(() => {
        if (question) {
            const context = `
            Question Title: ${question.title}
            Description: ${question.description}
            Options: ${question.options.join(", ")}
            Companies: ${question.companies.join(", ")}
            Topics: ${question.topics.join(", ")}
            Answer Type: ${question.type}
            `;
            setContextData(context);
        }
    }, [question, setContextData]);

    // UseEffect for client-side authorization check or updates if slug changes dynamically (less likely with SSR navigation)
    useEffect(() => {
        if (!initialQuestion) {
            setLoading(true);
            (async () => {
                try {
                    const response = await getAptiQuestionBySlug(slug)
                    await checkAuthorization(response, dispatch);
                    setQuestion(response.question)
                    setPreviousQuestionSlug(response.prevQuestionSlug)
                    setNextQuestionSlug(response.nextQuestionSlug)
                    setError("")
                } catch (e) {
                    setError("Failed to load question. Please try again.")
                } finally {
                    setLoading(false)
                }
            })()
        } else {
            setQuestion(initialQuestion)
            setPreviousQuestionSlug(prevSlug)
            setNextQuestionSlug(nextSlug)
        }
    }, [slug, initialQuestion, prevSlug, nextSlug, dispatch])

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
        <div className="container mx-auto py-4 md:py-10 flex flex-col md:flex-row justify-center md:justify-around items-start md:items-center gap-4 md:gap-0">
            {/* Desktop Previous Button */}
            <div className="hidden md:block w-20">
                {previousQuestionSlug &&
                    <Link href={`${previousQuestionSlug}`}
                        className={`text-neutral-500 hover:text-neutral-200 transition-colors`}
                    >
                        <ChevronLeft size={60} />
                    </Link>
                }
            </div>

            <div className="w-full max-w-2xl flex flex-col gap-4">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-xl md:text-2xl text-white/80">
                            Question {question?.questionNo}: {question?.title}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 mt-2 text-white/80">
                            {question?.companies.map(company => (
                                <Badge key={company} variant="secondary">{company}</Badge>
                            ))}
                            {question?.categories.map(category => (
                                <Badge key={category} variant="outline">{category}</Badge>
                            ))}
                            {question?.topics.map(topic => (
                                <Badge className="font-normal text-primary-text" key={topic}>{topic}</Badge>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-base md:text-lg text-white/80">{question?.description}</p>
                        {question?.type === "MCQ" ? (
                            <RadioGroup
                                onValueChange={(value) => handleAnswerChange(value)}
                                disabled={isSubmitted}
                            >
                                {question?.options.map((option, index) => (
                                    <div key={option} className="flex items-center space-x-2">
                                        <RadioGroupItem value={`${index}`} id={option} />
                                        <Label htmlFor={option} className="text-sm md:text-base leading-relaxed">{option}</Label>
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
                                        <Label htmlFor={option} className="text-sm md:text-base leading-relaxed">{option}</Label>
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
                                    <div className="flex gap-2 flex-col sm:flex-row">
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
                    <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
                            <Button className="w-full sm:w-auto text-primary-text" onClick={handleSubmit} disabled={selectedAnswers.length === 0 || isSubmitted}>
                                Submit Answer
                            </Button>
                            <Button className="w-full sm:w-auto" onClick={handleShowAnswer} disabled={attemptCount === 0 || showAnswer} variant="secondary">
                                Show Answer
                            </Button>
                        </div>
                    </CardFooter>
                </Card>

                {/* Mobile Navigation */}
                <div className="flex md:hidden justify-between w-full px-2">
                    {previousQuestionSlug ? (
                        <Button variant="outline" asChild className="flex items-center gap-2">
                            <Link href={`${previousQuestionSlug}`}>
                                <ChevronLeft className="h-4 w-4" /> Previous
                            </Link>
                        </Button>
                    ) : <div />} {/* Spacer */}

                    {nextQuestionSlug && (
                        <Button variant="outline" asChild className="flex items-center gap-2">
                            <Link href={`${nextQuestionSlug}`}>
                                Next <ChevronRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Desktop Next Button */}
            <div className="hidden md:block w-20 flex justify-end">
                {nextQuestionSlug &&
                    <Link href={`${nextQuestionSlug}`}
                        className={`text-neutral-500 hover:text-neutral-200 transition-colors`}
                    >
                        <ChevronRight size={60} />
                    </Link>
                }
            </div>
        </div>
    )
}