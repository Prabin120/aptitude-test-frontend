"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

interface Question {
  id: number
  text: string
  type: "single" | "multiple"
  options: string[]
}

const mockQuestions: Question[] = [
  {
    id: 1,
    text: "What is the capital of France?",
    type: "single",
    options: ["London", "Berlin", "Paris", "Madrid"]
  },
  {
    id: 2,
    text: "Which of the following are primary colors?",
    type: "multiple",
    options: ["Red", "Green", "Blue", "Yellow"]
  },
  // Add more questions as needed
]

export default function TestScreen() {
  const [showInstructions, setShowInstructions] = useState(true)
  const [timeLeft, setTimeLeft] = useState(3600) // 1 hour in seconds
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({})

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleCloseInstructions = () => {
    setShowInstructions(false)
  }

  const handleEndTest = () => {
    // Implement end test logic here
    console.log("Test ended", answers)
  }

  const handleAnswerChange = (questionId: number, answer: string | string[]) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }))
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const currentQuestion = mockQuestions[currentQuestionIndex]

  return (
    <div className="min-h-screen flex flex-col dark">
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Test Instructions</DialogTitle>
            <DialogDescription>
              Please read the following instructions carefully before starting the test:
              <ul className="list-disc list-inside mt-2">
                <li>You have 1 hour to complete the test.</li>
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
            Questions: {Object.keys(answers).length}/{mockQuestions.length}
          </div>
          <Button variant="destructive" onClick={handleEndTest}>End Test</Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Question {currentQuestion.id}</h2>
            <p className="text-lg mb-6">{currentQuestion.text}</p>
            {currentQuestion.type === "single" ? (
              <RadioGroup
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                value={answers[currentQuestion.id] as string}
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value={option} id={`q${currentQuestion.id}-option${index}`} />
                    <Label htmlFor={`q${currentQuestion.id}-option${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`q${currentQuestion.id}-option${index}`}
                      checked={(answers[currentQuestion.id] as string[] || []).includes(option)}
                      onCheckedChange={(checked) => {
                        const currentAnswers = answers[currentQuestion.id] as string[] || []
                        const newAnswers = checked
                          ? [...currentAnswers, option]
                          : currentAnswers.filter((a) => a !== option)
                        handleAnswerChange(currentQuestion.id, newAnswers)
                      }}
                    />
                    <Label htmlFor={`q${currentQuestion.id}-option${index}`}>{option}</Label>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <div className="mt-6 flex justify-between">
          <Button
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentQuestionIndex((prev) => Math.min(mockQuestions.length - 1, prev + 1))}
            disabled={currentQuestionIndex === mockQuestions.length - 1}
          >
            Next
          </Button>
        </div>
      </main>

      <footer className="bg-background p-4 border-t">
        <div className="container mx-auto">
          {/* <Progress value={(Object.keys(answers).length / mockQuestions.length) * 100} className="w-full" /> */}
          <Progress value={50} className="w-full" />
        </div>
      </footer>
    </div>
  )
}