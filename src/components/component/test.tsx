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
import { Dialog, DialogDescription, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "../ui/dialog"
import { Progress } from "../ui/progress"
import { handleGetMethod, handlePostMethod } from "@/utils/apiCall"
import { getTestEndpoint, postTestEndpoint } from "@/consts"
import { useRouter, useSearchParams } from "next/navigation"
import Loading from "@/app/loading"
import { useAppDispatch } from "@/redux/store"
import { setAuthState } from "@/redux/auth/authSlice"
import { setUserState, userInitialState } from "@/redux/user/userSlice"

interface Question {
    _id: string
    title: string
    type: "MCQ" | "MAQ"
    options: string[]
}

export default function TestPage() {
    const [timeLeft, setTimeLeft] = useState(3600) // 1 hour in seconds
    const [currentQuestionId, setCurrentQuestionId] = useState("")
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
    const [showInstructions, setShowInstructions] = useState(true)
    const [remainingQuestions, setRemainingQuestions] = useState(0)
    const router = useRouter();
    const [mockQuestions, setMockQuestions] = useState<Question[]>([]);
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams()

    const answersRef = useRef(answers);
    useEffect(() => {
        answersRef.current = answers;
    }, [answers]);

    const handleEndTest = async () => {        
        if (remainingQuestions < mockQuestions.length && timeLeft > 1) {
            const confirmation = confirm(`You have ${mockQuestions.length - remainingQuestions} questions remaining. Are you sure you want to end the test? Remember, once the time runs out, your answes will automatically submitted.`);
            if (!confirmation) return;
        }
        try {
            const answers = {...answersRef.current}
            const response = await handlePostMethod(postTestEndpoint, {answers}, searchParams.toString());
            if(response instanceof Response){
                const responseData = await response.json();
                if (response.status === 200 || response.status === 201) {
                    router.replace("/thank-you");
                    return;
                }
                else{
                    alert(responseData.message);
                }
            } else{
                alert(response.message);
            }
        } catch (error) {
            alert(error);
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await handleGetMethod(getTestEndpoint, searchParams.toString());
                if (response.status === 401 || response.status === 403) {
                    router.push("/login");
                    dispatch(setAuthState(false));
                    dispatch(setUserState(userInitialState));
                    return;
                }
                if(response instanceof Response){
                    const responseData = await response.json();
                    if (response.status === 200 || response.status === 201) {
                        setMockQuestions(responseData.questions);
                        setRemainingQuestions(0);  // Updated to use response data
                        const endTime = new Date(responseData.bookedTime);
                        const remaining = endTime.getTime() + (responseData.test.duration * 60 * 1000) - new Date().getTime();
                        setTimeLeft(remaining / 1000);
                    } 
                }
                // else {
                    // setError(responseData.message || "Failed to fetch test data.");
                // }
            } catch (error) {
                // setError("An error occurred while fetching test data.");
                console.error("API error:", error);
            }
        })();
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);  // Stop the timer
                    handleEndTest();       // Call handleEndTest when time runs out
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (mockQuestions.length === 0) {
        return (
            <Loading />
        )
    }

    const handleCloseInstructions = () => {
        setShowInstructions(false)
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
        }, 1000)
        return () => clearInterval(timer)
    }
    const handleAnswerChange = (questionId: string, answer: string | string[]) => {
        setAnswers((prevAnswers) => {
            const newAnswers = { ...prevAnswers };
            if (Array.isArray(answer) && answer.length === 0) {
                answer.length === 0 && setRemainingQuestions(remainingQuestions - 1);
            }
            if (!Object.keys(newAnswers).includes(String(questionId))) {
                setRemainingQuestions(remainingQuestions + 1);
            }
            else if(Array.isArray(answer) && answer.length === 1 && prevAnswers[questionId].length === 0) {
                setRemainingQuestions(remainingQuestions + 1);
            }
            newAnswers[questionId] = answer;
            return newAnswers;
        });        
    }

    const formatTime = (seconds: number) => {
        seconds = Math.floor(seconds);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };    

    const currentQuestion = mockQuestions.find(q => q._id === currentQuestionId) || mockQuestions[0]

    return (
        <div className="min-h-screen flex flex-col">
            <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
                <DialogContent aria-describedby={undefined}>
                    <DialogHeader>
                        <DialogTitle>Test Instructions</DialogTitle>
                        <DialogDescription>
                            Please read the following instructions carefully before starting the test:
                            <ul className="list-disc list-inside mt-2">
                                <li>There are {mockQuestions.length} questions in total.</li>
                                <li>Some questions may have multiple correct answers.</li>
                                <li>You can review and change your answers before submitting.</li>
                            </ul>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={handleCloseInstructions}>Continue</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <header className="sticky top-0 bg-background z-10 p-4 border-b">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-lg font-semibold">Time Left: {formatTime(timeLeft)}</div>
                    <div className="text-lg font-semibold">
                        Questions: {remainingQuestions}/{mockQuestions.length}
                    </div>
                    <Button variant="destructive" onClick={handleEndTest}>End Test</Button>
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
                                    answers[question._id] && "text-primary"
                                )}
                                onClick={() => setCurrentQuestionId(question._id)}
                            >
                                {Array.isArray(answers[question._id]) ? answers[question._id].length > 0 ? "✓ " : "" : answers[question._id] ? "✓ " : ""} {index+1}. {question.title.substring(0, 20)}...
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
                                {currentQuestion.type === "MCQ" ? (
                                    <RadioGroup
                                        value={answers[currentQuestion._id] as string || ""}
                                        onValueChange={(value) => handleAnswerChange(currentQuestion._id, value.toString())}                                    >
                                        {currentQuestion.options.map((option, index) => (
                                            <div key={index + 1} className="flex items-center space-x-2 mb-2">
                                                <RadioGroupItem value={option} id={`q${currentQuestion._id}-option${index + 1}`} />
                                                <Label htmlFor={`q${currentQuestion._id}-option${index + 1}`}>{option}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                ) : (
                                    <div className="space-y-2">
                                        {currentQuestion.options.map((option, index) => (
                                            <div key={index + 1} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`q${currentQuestion._id}-option${index + 1}`}
                                                    checked={(answers[currentQuestion._id])?.includes(option)}
                                                    onCheckedChange={(checked) => {
                                                        const currentAnswers = answers[currentQuestion._id] as string[] || []
                                                        return checked
                                                            ? handleAnswerChange(currentQuestion._id, [...currentAnswers, option])
                                                            : handleAnswerChange(currentQuestion._id, currentAnswers.filter((a) => a !== option))
                                                    }}
                                                />

                                                <Label htmlFor={`q${currentQuestion._id}-option${index}`}>{option}</Label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </ScrollArea>
                </ResizablePanel>
            </ResizablePanelGroup>

            <footer className="bg-background p-4 border-t">
                <div className="container mx-auto">
                    <Progress value={(Object.keys(answers).length / mockQuestions.length) * 100} className="w-full" />
                    {/* <Progress value={50} className="w-full" /> */}
                </div>
            </footer>
        </div>
    )
}