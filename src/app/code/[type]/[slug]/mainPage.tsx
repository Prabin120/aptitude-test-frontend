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
import { runTest, submitCodeAPI, handleGetMethod, getAihint, getAiFeedback } from "../../apiCalls"
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
import { Lightbulb } from "lucide-react"
import AiHelp from "./aiHelp"
import { useGetQuestionBySlug } from "@/hooks/reactQuery"
import Loading from "./loading"
import { setUserCodeState } from "@/redux/userCode/userCode"
import { getQuestionDescription } from "@/utils/cloudinary"

export default function CodingPlatformPage(parameters: Readonly<{ slug: string, type: string, time: string }>) {
    const [code, setCode] = useState<UserCode>()
    const [language, setLanguage] = useState("")
    const [question, setQuestion] = useState<QuestionPage>()
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
    const [aihelp, setAihelp] = useState(false);
    const [aihelpText, setAihelpText] = useState("Please try once by yourself. Then I will help you.");
    const dispatch = useAppDispatch();
    const router = useRouter();
    const savedCodes = useAppSelector((state) => state.userCode.codes)

    const { data: response, isLoading, isError } = useGetQuestionBySlug(slug);

    const initilisation = async (response: QuestionPage) => {
        const questionRes = {
            _id: response._id,
            title: response.title,
            slug: response.slug,
            description: response.description,
            difficulty: response.difficulty,
            tags: response.tags,
            userStatus: response.userStatus,
            donatedBy: response.donatedBy,
        };
        questionRes.description = await getQuestionDescription(response.slug)
        setQuestion(questionRes)
        return questionRes
    }

    useEffect(() => {
        if (response) {
            (async () => {
                const questionRes = await initilisation(response)
                const languages = ["c", "cpp", "go", "java", "js", "py"]
                const defaultCodeTemp: DefaultCode = {}
                const userCodeTemp: UserCode = {}

                languages.forEach((lang) => {
                    const savedCode = savedCodes[type]?.[questionRes._id]?.[lang]
                    defaultCodeTemp[lang] = response.codeTemplates[lang]
                    userCodeTemp[lang] = savedCode || response.codeTemplates[lang].template

                    if (!savedCode) {
                        dispatch(
                            setUserCodeState({
                                type: type,
                                questionNo: questionRes._id,
                                language: lang,
                                code: response.codeTemplates[lang].template,
                            }),
                        )
                    }
                })

                setDefaultCode(defaultCodeTemp)
                setCode(userCodeTemp)
                const savedLanguage = Object.keys(savedCodes[type]?.[questionRes._id] || {})[0]
                setLanguage(savedLanguage || "py")
                setTestCases(response.sampleTestCases)
                setTestCaseVariableNames(response.testCaseVariableNames)
            })()
        }
    }, [response])

    const fetchSubmissions = async () => {
        console.log("Fetching submissions");
        if (activeTabQuestion === "submissions" && submissions?.length === 0) {
            console.log("Fetching submissions api");
            const data = async () => {
                const response = await handleGetMethod(getCodeSubmissions + `?question=${question?._id}`);
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
    }
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
                if (!res.success) {
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
            setAihelp(true)
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
                if (res.success) {
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
                if (!submissions || submissions.length === 0) {
                    setSubmissions([{ ...res.data, code: code[language], language: language }])
                } else {
                    setSubmissions(prev => [...prev, { ...res.data, code: code[language], language: language }])
                }
                setIsResultModalOpen(true)
                if (type === "exam") {
                    dispatch(
                        setCodingTestState({
                            questionNo: question?._id ?? "",
                            code: code ? code[language] : "",
                            questionKind: "aptitude",
                            language: language,
                            passedTestCases: res.data.passedTestCases ?? 0,
                            totalTestCases: res.data.totalTestCases ?? 0
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

    const aiHintFunction = async () => {
        setLoading(true)
        setAihelpText("")
        setActiveTabQuestion("aihelp")
        try {
            const res = await getAihint(code ? code[language] : "", language, question?.title + "\n" + question?.description)
            setAihelpText(res)
        } catch (error) {
            setError(error as string)
        } finally {
            setLoading(false)
        }
    }

    const aiFeedbackFunction = async () => {
        setLoading(true)
        setAihelpText("")
        setIsResultModalOpen(false)
        setActiveTabQuestion("aihelp")
        try {
            const res = await getAiFeedback(code ? code[language] : "", language,
                question?.title + "\n" + question?.description,
                submissionResult?.passedTestCases ?? 0, submissionResult?.totalTestCases ?? 0)
            setAihelpText(res)
        } catch (error) {
            setError(error as string)
        } finally {
            setLoading(false)
        }
    }

    if (!question || !code || !language || isError) {
        <div className="flex justify-center items-center">Error loading page</div>
        return
    }
    if (isLoading) {
        return <Loading />
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
                            {type !== "exam" &&
                                <>
                                    <TabsTrigger onClick={fetchSubmissions} value="submissions">Submissions</TabsTrigger>
                                    <TabsTrigger value="aihelp"><Lightbulb color="yellow" size={15} /> Smart AC</TabsTrigger>
                                </>
                            }
                        </TabsList>
                        <TabsContent value="question">
                            <CodeQuestion key={"question"} data={question} type={type} />
                        </TabsContent>
                        <TabsContent value="submissions">
                            <Submissions submissions={submissions} testCaseVariableNames={testCaseVariableNames} aiFeedback={aiFeedbackFunction} />
                        </TabsContent>
                        <TabsContent value="aihelp">
                            <AiHelp aihelpText={aihelpText} />
                        </TabsContent>
                    </Tabs>
                </ResizablePanel>

                <ResizableHandle />
                {/* Code editor and results column */}
                <ResizablePanel defaultSize={50}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={60}>
                            {/* Code editor */}
                            <CodeEditor key={"code-editor"} code={code} setCode={setCode} language={language} setLanguage={setLanguage} defaultCode={defaultCode} questionNo={question._id} type={type} />
                        </ResizablePanel>
                        <ResizableHandle />
                        <ResizablePanel defaultSize={40}>
                            {/* Test cases and results */}
                            <TestCases key={"test-cases"} testCases={testCases} testCaseVariableNames={testCaseVariableNames} loading={loading} error={error} aihelp={aihelp} aiHintFunction={aiHintFunction} type={type} />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
            {/* Submission Result Modal */}
            <Dialog open={isResultModalOpen} onOpenChange={(open) => { setIsResultModalOpen(open); type === "exam" && router.back() }}>
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
                            testCaseVariableNames={testCaseVariableNames}
                            aiFeedback={aiFeedbackFunction}
                            type={type}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}