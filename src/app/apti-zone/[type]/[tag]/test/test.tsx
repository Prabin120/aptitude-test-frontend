"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import Loading from "@/app/loading"
import { getAptiQuestionByTag } from "@/app/apti-zone/apicalls"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle } from "lucide-react"

interface Question {
    _id: string
    title: string
    description: string
    type: "MCQ" | "MAQ"
    options: string[]
    answers: number[]
    marks: number
}

export default function TestPage({ type, tag }: Readonly<{ type: string, tag: string }>) {
    const [currentQuestionId, setCurrentQuestionId] = useState("")
    const [answers, setAnswers] = useState<Record<string, number | number[]>>({})
    const [remainingQuestions, setRemainingQuestions] = useState(0)
    const [isTestEnded, setIsTestEnded] = useState(false)
    const router = useRouter();
    const [mockQuestions, setMockQuestions] = useState<Question[]>([]);
    const answersRef = useRef(answers);
    useEffect(() => {
        answersRef.current = answers;
    }, [answers]);

    const handleEndTest = async () => {
        if (remainingQuestions < mockQuestions.length) {
            const confirmation = confirm(`You have ${mockQuestions.length - remainingQuestions} questions remaining. Are you sure you want to end the test? Remember, once the time runs out, your answers will automatically be submitted.`);
            if (!confirmation) return;
        }
        setIsTestEnded(true);
        // try {
        //     const answers = {...answersRef.current}
        // const response = await handlePostMethod(postTestEndpoint, {answers}, searchParams.toString());
        // if(response instanceof Response){
        //     const responseData = await response.json();
        //     if (response.status === 200 || response.status === 201) {
        //         // We're not redirecting immediately to allow the user to review their answers
        //         // router.replace("/thank-you");
        //         return;
        //     }
        //     else{
        //         alert(responseData.message);
        //     }
        // } else{
        //     alert(response.message);
        // }
        // } catch (error) {
        //     alert(error);
        // }
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await getAptiQuestionByTag(type, tag, 1, 30);
                setMockQuestions(response.data);
                setRemainingQuestions(0);  // Updated to use response data
            } catch (error) {
                console.error("API error:", error);
            }
        })();
    }, ['dispatch', 'handleEndTest', 'router', 'searchParams']);

    if (mockQuestions.length === 0) {
        return (
            <Loading />
        )
    }
    const handleAnswerChange = (questionId: string, answer: number | number[]) => {
        setAnswers((prevAnswers) => {
            const newAnswers = { ...prevAnswers };
            if (Array.isArray(answer) && answer.length === 0) {
                answer.length === 0 && setRemainingQuestions(remainingQuestions - 1);
            }
            if (!Object.keys(newAnswers).includes(String(questionId))) {
                setRemainingQuestions(remainingQuestions + 1);
            }
            else if (Array.isArray(answer) && answer.length === 1 && Array.isArray(prevAnswers[questionId]) && prevAnswers[questionId].length === 0)
                setRemainingQuestions(remainingQuestions + 1);
            newAnswers[questionId] = answer;
            return newAnswers;
        });
    }
    const currentQuestion = mockQuestions.find(q => q._id === currentQuestionId) || mockQuestions[0]

    const isAnswerCorrect = (question: Question) => {
        const userAnswer = answers[question._id];
        if (Array.isArray(userAnswer)) {
            return JSON.stringify(userAnswer.sort()) === JSON.stringify(question.answers.sort());
        }
        return userAnswer === question.answers[0];
    }

    return (
        <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 bg-background z-10 p-4 border-b">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-lg font-semibold">
                        Questions: {remainingQuestions}/{mockQuestions.length}
                    </div>
                    {!isTestEnded ? (
                        <Button variant="destructive" onClick={handleEndTest}>End Test</Button>
                    ) : (
                        <Button onClick={() => router.replace("/thank-you")}>Back Home</Button>
                    )}
                </div>
            </header>

            <ResizablePanelGroup direction="horizontal" className="flex-grow">
                <ResizablePanel defaultSize={25} minSize={20}>
                    <ScrollArea className="h-[calc(100vh-10rem)] p-4">
                        {mockQuestions.map((question, index) => (
                            <Button
                                key={index}
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start mb-2",
                                    currentQuestionId === question._id && "bg-accent",
                                    answers[question._id] && "text-primary",
                                    isTestEnded && (isAnswerCorrect(question) ? "bg-green-500" : "bg-red-500")
                                )}
                                onClick={() => setCurrentQuestionId(question._id)}
                            >
                                {Array.isArray(answers[question._id]) ? (answers[question._id] as number[]).length > 0 ? "✓ " : "" : answers[question._id] ? "✓ " : ""} {index + 1}. {question.title.substring(0, 20)}...
                            </Button>
                        ))}
                    </ScrollArea>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel>
                    <ScrollArea className="h-[calc(100vh-10rem)] p-4">
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-bold mb-4">Question</h2>
                                <div className="text-lg mb-6">{currentQuestion.title}</div>
                                {currentQuestion?.type === "MCQ" ? (
                                    <RadioGroup
                                        value={answers[currentQuestion._id] ? answers[currentQuestion._id].toString() : ""}
                                        onValueChange={(value) => handleAnswerChange(currentQuestion._id, Number(value))}
                                    >
                                        {currentQuestion?.options.map((option, index) => (
                                            <div key={option} className="flex items-center space-x-2">
                                                <RadioGroupItem value={`${index + 1}`} id={option} />
                                                <Label htmlFor={option}>{option}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                ) : (
                                    <div className="space-y-2">
                                        {currentQuestion.options.map((option, index) => (
                                            <div key={index + 1} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`q${currentQuestion._id}-option${index + 1}`}
                                                    checked={(answers[currentQuestion._id] as number[])?.includes(index + 1)}
                                                    onCheckedChange={(checked) => {
                                                        const currentAnswers = Array.isArray(answers[currentQuestion._id]) ? answers[currentQuestion._id] as number[] : [];
                                                        const updatedAnswers = checked
                                                            ? [...currentAnswers, index + 1]
                                                            : currentAnswers.filter((a) => a !== index + 1);
                                                        handleAnswerChange(currentQuestion._id, updatedAnswers);
                                                    }}
                                                    disabled={isTestEnded}
                                                />
                                                <Label htmlFor={`q${currentQuestion._id}-option${index}`}>{option}</Label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {isTestEnded && (
                                    <Alert variant={isAnswerCorrect(currentQuestion) ? "default" : "destructive"} className="mt-4">
                                        <AlertTitle className="flex items-center">
                                            {isAnswerCorrect(currentQuestion) ? (
                                                <>
                                                    <CheckCircle2 className="mr-2" />
                                                    Correct!
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="mr-2" />
                                                    Incorrect
                                                </>
                                            )}
                                        </AlertTitle>
                                        <AlertDescription>
                                            {isAnswerCorrect(currentQuestion)
                                                ? "Great job! You've selected the right answer(s)."
                                                : `The correct answer(s) is/are: ${currentQuestion?.answers.map(ans =>
                                                    currentQuestion.options.find((opt, index) => index + 1 === ans)
                                                ).join(", ")}`
                                            }
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    </ScrollArea>
                </ResizablePanel>
            </ResizablePanelGroup>

            <footer className="bg-background p-4 border-t">
                <div className="container mx-auto">
                    <Progress value={(Object.keys(answers).length / mockQuestions.length) * 100} className="w-full" />
                </div>
            </footer>
        </div>
    )
}