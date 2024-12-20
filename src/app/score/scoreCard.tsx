import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle2, XCircle } from "lucide-react"
import { handleGetMethod } from "@/utils/apiCall"
import { scoreCardEndpoint } from "@/consts"
import { useRouter, useSearchParams } from "next/navigation"
import { useAppDispatch } from "@/redux/store"
import { setAuthState } from "@/redux/auth/authSlice"
import { setUserState, userInitialState } from "@/redux/user/userSlice"

interface Question {
    _id: number
    title: string
    options: string[]
    answer: string[]
    type: 'MCQ' | 'MAQ'
}

interface UserAnswer {
    _id: string
    answer: string | string[]
}

export default function ScoreCard() {
    const [questions, setQuestions] = useState<Question[]>([])
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
    const [score, setScore] = useState(0)
    const [totalScore, setTotalScore] = useState(0)
    const [error, setError] = useState<string>("")
    const router = useRouter();
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams()

    useEffect(() => {
        (async () => {
            const response = await handleGetMethod(scoreCardEndpoint,searchParams.toString())
            if (response instanceof Response) {
                const responseData = await response.json();
                if (response.status === 200 || response.status === 201) {
                    const userTest = responseData.data
                    setQuestions(responseData.questions)
                    setUserAnswers(userTest.answers)
                    setScore(userTest.marksAchieved)
                    setTotalScore(userTest.totalMarks)
                }
                else if (response.status === 401 || response.status === 403) {
                    dispatch(setAuthState(false));
                    dispatch(setUserState(userInitialState));
                    router.push("/login");
                }
                else{
                    setError(responseData.message ?? "Failed to fetch test data.")
                }
            }
            else{
                setError(response.message ?? "Failed to fetch test data.")
            }
        })()
    }, [dispatch, searchParams, router])
    
    if(error) return <p className="text-red-500 text-center">{error}</p>

    return (
        <div className="container mx-auto py-10">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl">Your Score Card</CardTitle>
                    <CardDescription>
                        You scored {score} out of {totalScore}.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[600px] pr-4">
                        {questions.map((question, index) => {
                            const choosenAnswer = userAnswers ? userAnswers[question._id] : "";
                            const correctAnswer = question.answer
                            const isCorrect = question.type === "MCQ"
                                ? typeof choosenAnswer == "string" && choosenAnswer == correctAnswer[0] as string // For MCQ, compare string answers
                                : Array.isArray(choosenAnswer) && choosenAnswer.sort().toString() === correctAnswer.sort().toString(); // For MAQ, compare arrays
                            return (
                                <div key={question._id} className="mb-6 pb-6 border-b last:border-b-0">
                                    <h3 className="text-lg font-semibold mb-2">
                                        Question {index + 1}: {question.title}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {question.options.map((option, optionIndex) => (
                                            <div
                                                key={optionIndex}
                                                className={`p-3 rounded-md ${
                                                    correctAnswer.includes(option)
                                                        ? "bg-green-100 dark:bg-green-900"
                                                        : Array.isArray(choosenAnswer) && choosenAnswer.includes(option) && !correctAnswer.includes(option)
                                                        ? "bg-red-100 dark:bg-red-900"
                                                        : typeof choosenAnswer == "string" && choosenAnswer === option && !correctAnswer.includes(option)
                                                        ? "bg-red-100 dark:bg-red-900"
                                                        : "bg-gray-100 dark:bg-gray-800"
                                                }`}
                                            >
                                                {option}
                                                {typeof question.answer == "string" && option === question.answer && (
                                                    <CheckCircle2 className="inline-block ml-2 text-green-600 dark:text-green-400" size={18} />
                                                )}
                                                {typeof choosenAnswer == "string" && option === choosenAnswer && !isCorrect && (
                                                    <XCircle className="inline-block ml-2 text-red-600 dark:text-red-400" size={18} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-2 text-sm">
                                        Your answer: <span className={isCorrect ? "text-green-600 dark:text-green-400 font-semibold" : "text-red-600 dark:text-red-400 font-semibold"}>{`${choosenAnswer}`}</span>
                                    </p>
                                    {!isCorrect && (
                                        <p className="mt-1 text-sm">
                                            Correct answer: <span className="text-green-600 dark:text-green-400 font-semibold">{question.answer}</span>
                                        </p>
                                    )}
                                </div>
                            )
                        })}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}