"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Plus } from "lucide-react"
import { getAllAptiQuestions } from "@/app/aptitude/apicalls"
import { getAllQuestions } from "@/app/coding/apiCalls"

interface Question {
    _id: string
    slug: string
    title: string
    marks: number
}

interface SearchableQuestionsProps {
    selectedQuestions: Question[]
    onQuestionsChange: (questions: Question[]) => void
    questionType: "aptitude" | "coding"
}

export function SearchableQuestions({ selectedQuestions, onQuestionsChange, questionType }: SearchableQuestionsProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [searchResults, setSearchResults] = useState<Question[]>([])
    const [marks, setMarks] = useState<Record<string, string>>({})

    useEffect(() => {
        const debounceSearch = async () => {
            if (searchTerm.length > 2) {
                const debounceTimeout = setTimeout(async () => {
                    if (questionType === "aptitude") {
                        const response = await getAllAptiQuestions(1, searchTerm)
                        setSearchResults(response.data)
                    } else {
                        const response = await getAllQuestions("?search=" + searchTerm)
                        setSearchResults(response?.questions)
                    }
                }, 500)
                return () => clearTimeout(debounceTimeout)
            } else {
                setSearchResults([])
            }
        }
        debounceSearch()
    }, [searchTerm, questionType])

    const handleAddQuestion = (question: Question) => {
        if (!selectedQuestions?.some((q) => q._id === question._id)) {
            const updatedQuestion = { ...question, marks: Number(marks[question._id]) || 0 }
            onQuestionsChange([...selectedQuestions, updatedQuestion])
            setMarks((prev) => ({ ...prev, [question._id]: "" }))
        }
    }

    const handleRemoveQuestion = (questionId: string) => {
        onQuestionsChange(selectedQuestions.filter((q) => q._id !== questionId))
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <Input
                    type="text"
                    placeholder={`Type at least 3 letters to search ${questionType} questions...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type="button" size="icon">
                    <Search className="h-4 w-4" />
                </Button>
            </div>
            {searchResults?.length > 0 && (
                <Card>
                    <CardContent className="p-2">
                        <ul className="space-y-2">
                            {searchResults?.map((question) => (
                                <li key={question._id} className="flex justify-between items-center">
                                    <span>{question.title}</span>
                                    <div className="flex items-center space-x-2">
                                        <Input
                                            type="number"
                                            placeholder="Marks"
                                            value={marks[question._id] || ""}
                                            onChange={(e) => setMarks((prev) => ({ ...prev, [question._id]: e.target.value }))}
                                            className="w-20"
                                        />
                                        <Button type="button" size="sm" onClick={() => handleAddQuestion(question)}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}
            {selectedQuestions?.length > 0 && (
                <div>
                    <h4 className="font-medium mb-2">Selected Questions:</h4>
                    <ul className="space-y-2">
                        {selectedQuestions.map((question) => (
                            <li key={question._id} className="flex justify-between items-center bg-secondary p-2 rounded">
                                <span>{question.title || `Question ${question._id}`}</span>
                                <div className="flex items-center space-x-2">
                                    <span>Marks: {question.marks}</span>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleRemoveQuestion(question._id)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

