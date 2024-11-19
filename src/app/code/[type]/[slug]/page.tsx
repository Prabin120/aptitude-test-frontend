"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Play, Send } from "lucide-react"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import CodeQuestion from "./question"
import CodeEditor from "./code-editor"
import TestCases from "./test-cases"
import Link from "next/link"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"
import { getQuestionBySlug, runTest, submitCodeAPI } from "../../apiCalls"
import CircleLoading from "@/components/ui/circleLoading"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import SubmissionResult from "./result"

export default function CodingPlatformPage(context: { params: Params }) {
    const [code, setCode] = useState<UserCode>()
    const [language, setLanguage] = useState("py")
    const [question, setQustion] = useState<QuestionPage>()
    const [defaultCode, setDefaultCode] = useState<DefaultCode>()
    const [testCases, setTestCases] = useState<TestCase[]>()
    const [testCaseVariableNames, setTestCaseVariableNames] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const { slug } = context.params;
    const [isResultModalOpen, setIsResultModalOpen] = useState(false)
    const [submissionResult, setSubmissionResult] = useState<SubmissionResultProps>({
        status: "runtime_error",
        message: "Some error occurred",
        passedTestCases: 0,
        totalTestCases: 0
    })
    useEffect(() => {
        (async () => {
            const response = await getQuestionBySlug(slug)
            const question = { _id: response._id, title: response.title, description: response.description, difficulty: response.difficulty, tags: response.tags }
            setQustion(question)
            const defaultCodeTemp: DefaultCode = {
                c: response.codeTemplates.c,
                cpp: response.codeTemplates.cpp,
                go: response.codeTemplates.go,
                java: response.codeTemplates.java,
                js: response.codeTemplates.js,
                py: response.codeTemplates.py
            }
            setDefaultCode(defaultCodeTemp)
            const userCodeTemp: UserCode = {
                c: response.codeTemplates.c.template,
                cpp: response.codeTemplates.cpp.template,
                go: response.codeTemplates.go.template,
                java: response.codeTemplates.java.template,
                js: response.codeTemplates.js.template,
                py: response.codeTemplates.py.template
            }
            setCode(userCodeTemp)
            setTestCases(response.sampleTestCases)
            setTestCaseVariableNames(response.testCaseVariableNames)
        })()
    }, [])
    const runCode = async () => {
        setLoading(true)
        if (!code || !language || !question) {
            return
        }
        const response = await runTest(code ? code[language] : "", language, question._id)
        if (response instanceof Response) {
            const res = await response.json()
            if (!res.status) {
                setError(res.message)
            } else {
                setTestCases(res.data)
                setError("")
            }
        } else {
            setError(response.message)
        }
        setLoading(false)
    }

    const submitCode = async () => {
        setLoading(true)
        if (!code || !language || !question) {
            return
        }
        const response = await submitCodeAPI(code ? code[language] : "", language, question._id)
        if (response instanceof Response) {
            const res = await response.json()
            let status = "runtime_error"
            if(res.status){
                if(res.data.failedCase == null){
                    status = "accepted"
                } else{
                    status = "wrong_answer"
                }
            }
            res.data.status = status
            setSubmissionResult(res.data)
            setIsResultModalOpen(true)
        } else {
            setError(response.message)
        }
        setLoading(false)
    }

    if (!question || !code || !language) {
        <div className="flex justify-center items-center">Error loading page</div>
        return
    }

    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-2">
                    <Link className="flex items-center justify-center" href="/">
                        <span className="font-bold text-lg">AptiTest</span>
                    </Link>
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={runCode} disabled={loading} size="sm">
                        {loading ? <CircleLoading color="bg-neutral-50" /> : <><Play className="mr-2 h-4 w-4" />Run</>}
                    </Button>
                    <Button onClick={submitCode} size="sm" variant="secondary">
                        {loading ? <CircleLoading color="bg-neutral-50" /> :
                            <><Send className="mr-2 h-4 w-4" /> Submit</>
                        }
                    </Button>
                </div>
                <Avatar>
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </header>

            {/* Main content */}
            <ResizablePanelGroup
                direction="horizontal"
                className="rounded-lg border">
                {/* Question column */}
                <ResizablePanel defaultSize={50}>
                    <CodeQuestion key={"question"} data={question} />
                </ResizablePanel>

                <ResizableHandle />
                {/* Code editor and results column */}
                <ResizablePanel defaultSize={50}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={60}>
                            {/* Code editor */}
                            <CodeEditor key={"code-editor"} code={code} setCode={setCode} language={language} setLanguage={setLanguage} defaultCode={defaultCode} />
                        </ResizablePanel>
                        <ResizableHandle />
                        <ResizablePanel defaultSize={40}>
                            {/* Test cases and results */}
                            <TestCases key={"test-cases"} testCases={testCases} testCaseVariableNames={testCaseVariableNames} loading={loading} error={error} />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
            {/* Submission Result Modal */}
            <Dialog open={isResultModalOpen} onOpenChange={setIsResultModalOpen}>
                <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>Submission Result</DialogTitle>
                    </DialogHeader>
                    {submissionResult && (
                        <SubmissionResult
                            status={submissionResult.status}
                            passedTestCases={submissionResult.passedTestCases}
                            totalTestCases={submissionResult.totalTestCases}
                            // runtimeMs={submissionResult.runtimeMs}
                            // memoryMb={submissionResult.memoryMb}
                            // runtimePercentile={submissionResult.runtimePercentile}
                            // memoryPercentile={submissionResult.memoryPercentile}
                            // code={code ? code[language] : ""}
                            message={submissionResult.message}
                            failedCase={submissionResult.failedCase}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}