"use client"

import { useEffect, useState } from "react"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import CodeQuestion from "./question"
import CodeEditor from "./code-editor"
import TestCases from "./test-cases"
import { getQuestionBySlug, runTest, submitCodeAPI, handleGetMethod } from "../../apiCalls"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import SubmissionResult from "./result"
import { DefaultCode, QuestionPage, SubmissionResultProps, TestCase, UserCode } from "../../commonInterface"
import { checkAuthorization } from "@/utils/authorization"
import CodeHeader from "./header"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { setCodingTestState } from "@/redux/testAnswers/codingAnswers"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Submissions from "./submissions"
import { getCodeSubmissions } from "@/consts"

export default function CodingPlatformPage(parameters: Readonly<{ slug: string, type: string, time: string }>) {
    const [code, setCode] = useState<UserCode>()
    const [language, setLanguage] = useState("py")
    const [question, setQustion] = useState<QuestionPage>()
    const [defaultCode, setDefaultCode] = useState<DefaultCode>()
    const [testCases, setTestCases] = useState<TestCase[]>()
    const [testCaseVariableNames, setTestCaseVariableNames] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const { slug, type, time } = parameters;
    const [isResultModalOpen, setIsResultModalOpen] = useState(false)
    const [activeTabQuestion, setActiveTabQuestion] = useState("question");
    const [submissions, setSubmissions] = useState<SubmissionResultProps[]>([])
    const [submissionResult, setSubmissionResult] = useState<SubmissionResultProps>()
    const dispatch = useAppDispatch();
    const router = useRouter();
    const savedCodes = useAppSelector((state) => state.userCode.codes)
    useEffect(() => {
        (async () => {
            const response = await getQuestionBySlug(slug)
            const question = { _id: response._id, title: response.title, description: response.description, difficulty: response.difficulty, tags: response.tags, userStatus: response.userStatus }
            setQustion(question)
            const defaultCodeTemp: DefaultCode = {
                c: savedCodes?.find(d => d.questionNo === question._id && d.language === "c")?.code ?? response.codeTemplates.c,
                cpp: savedCodes?.find(d => d.questionNo === question._id && d.language === "cpp")?.code ?? response.codeTemplates.cpp,
                go: savedCodes?.find(d => d.questionNo === question._id && d.language === "go")?.code ?? response.codeTemplates.go,
                java: savedCodes?.find(d => d.questionNo === question._id && d.language === "java")?.code ?? response.codeTemplates.java,
                js: savedCodes?.find(d => d.questionNo === question._id && d.language === "js")?.code ?? response.codeTemplates.js,
                py: savedCodes?.find(d => d.questionNo === question._id && d.language === "py")?.code ?? response.codeTemplates.py
            }
            setDefaultCode(defaultCodeTemp)
            const userCodeTemp: UserCode = {
                c: savedCodes?.find(d => d.questionNo === question._id && d.language === "c")?.code ?? response.codeTemplates.c.template,
                cpp: savedCodes?.find(d => d.questionNo === question._id && d.language === "cpp")?.code ?? response.codeTemplates.cpp.template,
                go: savedCodes?.find(d => d.questionNo === question._id && d.language === "go")?.code ?? response.codeTemplates.go.template,
                java: savedCodes?.find(d => d.questionNo === question._id && d.language === "java")?.code ?? response.codeTemplates.java.template,
                js: savedCodes?.find(d => d.questionNo === question._id && d.language === "js")?.code ?? response.codeTemplates.js.template,
                py: savedCodes?.find(d => d.questionNo === question._id && d.language === "py")?.code ?? response.codeTemplates.py.template
            }
            setLanguage(savedCodes?.find(d => d.questionNo === question._id)?.language ?? "py")
            setCode(userCodeTemp)
            setTestCases(response.sampleTestCases)
            setTestCaseVariableNames(response.testCaseVariableNames)
        })()
    }, [slug])
    useEffect(() => {
        if(activeTabQuestion === "submissions" && submissions?.length === 0) {
            const data = async () => {
                const response = await handleGetMethod(getCodeSubmissions+`?question=${question?._id}`);
                if (response instanceof Response) {
                    const res = await response.json()
                    if (response.status === 200 || response.status === 201) {
                        setSubmissions(res.data);
                    } else {
                        setError(res.message);
                    }
                } else {
                    setError(response.message);
                }
            }
            data()
        }
    }, [activeTabQuestion, question?._id, submissions?.length])
    const runCode = async () => {
        setLoading(true)
        if (!code || !language || !question) {
            return
        }
        try {
            const response = await runTest(code ? code[language] : "", language, question._id)
            if (response instanceof Response) {
                await checkAuthorization(response, dispatch)
                if (response.status == 401) {
                    alert("Please login first")
                    await checkAuthorization(response, dispatch)
                }
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
        } catch (error) {
            setError(error as string)
        } finally {
            setLoading(false)
        }
    }

    const submitCode = async () => {
        setLoading(true)
        try {
            if (!code || !language || !question) {
                return
            }
            const response = await submitCodeAPI(code ? code[language] : "", language, question._id, question.userStatus)
            if (response instanceof Response) {
                await checkAuthorization(response, dispatch)
                const res = await response.json()
                let status;
                if (res.status) {
                    if (res.data.failedCase == null) {
                        status = "accepted"
                    } else {
                        status = "wrong_answer"
                    }
                } else {
                    setError(res.message)
                    status = "runtime_error"
                    return
                }
                res.data.status = status
                setSubmissionResult(res.data)
                setSubmissions(prev => [...prev, {...res.data, code: code[language], language: language}])
                setIsResultModalOpen(true)
                if (type === "exam") {
                    dispatch(
                        setCodingTestState({
                            questionNo: question?._id??"",
                            code: code ? code[language] : "",
                            questionKind: "aptitude",
                            language: language,
                            passedTestCases: res.data.passedTestCases??0,
                            totalTestCases: res.data.totalTestCases??0
                        })
                    );
                }
            } else {
                setError(response.message)
            }
        } catch (error) {
            setError(error as string)
        } finally {
            setLoading(false)
        }
    }

    if (!question || !code || !language) {
        <div className="flex justify-center items-center">Error loading page</div>
        return
    }
    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <CodeHeader runCode={runCode} submitCode={submitCode} loading={loading} type={type} time={time} />

            {/* Main content */}
            <ResizablePanelGroup
                direction="horizontal"
                className="rounded-lg border">
                {/* Question column */}
                <ResizablePanel defaultSize={50}>
                    <Tabs value={activeTabQuestion} onValueChange={setActiveTabQuestion} 
                        defaultValue={activeTabQuestion} className='w-full items-center bg-neutral-800 h-7'>
                        <TabsList className="h-6">
                            <TabsTrigger value={"question"}>Description</TabsTrigger>
                            { type !== "exam" && 
                                <TabsTrigger value="submissions">Submissions</TabsTrigger>}
                        </TabsList>
                        <TabsContent value="question">
                            <CodeQuestion key={"question"} data={question} />
                        </TabsContent>
                        <TabsContent value="submissions">
                            <Submissions submissions={submissions} testCaseVariableNames={testCaseVariableNames}/>
                        </TabsContent>
                    </Tabs>
                </ResizablePanel>

                <ResizableHandle />
                {/* Code editor and results column */}
                <ResizablePanel defaultSize={50}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={60}>
                            {/* Code editor */}
                            <CodeEditor key={"code-editor"} code={code} setCode={setCode} language={language} setLanguage={setLanguage} defaultCode={defaultCode} questionNo={question._id}/>
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
            <Dialog open={isResultModalOpen} onOpenChange={(open) => {setIsResultModalOpen(open); type === "exam" && router.back()}}>
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
                            code={code ? code[language] : ""}
                            message={submissionResult.message}
                            failedCase={submissionResult.failedCase}
                            testCaseVariableNames = {testCaseVariableNames}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}