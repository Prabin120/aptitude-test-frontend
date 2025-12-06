"use client"

import { useState } from "react"
import { Check, AlertTriangle, XCircle, Copy, Lightbulb } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SubmissionResultProps, SubmissionStatus } from "../../commonInterface"
import { structuredTestCases } from "@/utils/commonFunction"

export default function SubmissionResult({
    status,
    passedTestCases,
    totalTestCases,
    code = "",
    message,
    failedCase,
    testCaseVariableNames,
    aiFeedback,
    type,
}: Readonly<SubmissionResultProps>) {
    const [activeTab, setActiveTab] = useState("result")
    const getStatusColor = (status: SubmissionStatus) => {
        switch (status) {
            case "accepted":
                return "text-green-500"
            case "runtime_error":
                return "text-red-500"
            case "wrong_answer":
                return "text-red-500"
            default:
                return "text-gray-500"
        }
    }

    const getStatusIcon = (status: SubmissionStatus) => {
        switch (status) {
            case "accepted":
                return <Check className="h-5 w-5" />
            case "runtime_error":
                return <AlertTriangle className="h-5 w-5" />
            case "wrong_answer":
                return <XCircle className="h-5 w-5" />
        }
    }

    const getStatusTitle = (status: SubmissionStatus) => {
        switch (status) {
            case "accepted":
                return "Accepted"
            case "runtime_error":
                return "Runtime Error"
            case "wrong_answer":
                return "Wrong Answer"
        }
    }

    return (
        <div className="container mx-auto p-6 bg-zinc-950 min-h-screen text-zinc-100">
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="border-b border-zinc-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className={getStatusColor(status)}>{getStatusIcon(status)}</span>
                            <CardTitle className={`text-xl ${getStatusColor(status)}`}>
                                {getStatusTitle(status)}
                            </CardTitle>
                            {status !== "accepted" && (
                                <Badge variant="outline" className="ml-2">
                                    {passedTestCases} / {totalTestCases} testcases passed
                                </Badge>
                            )}
                        </div>
                        {type != "exam" && <Button onClick={aiFeedback} variant={"outline"}>Get Smart FeedBack <Lightbulb size={20} color="yellow"/></Button>}
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="w-full justify-start rounded-none border-b border-zinc-800 bg-zinc-900 p-0">
                            <TabsTrigger
                                value="result"
                                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
                            >
                                Result
                            </TabsTrigger>
                            <TabsTrigger
                                value="code"
                                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
                            >
                                Code
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="result" className="p-4">
                            {status === "accepted" && (
                                <div className="grid gap-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-zinc-400">Runtime</span>
                                                <span className="font-mono">
                                                    {failedCase?.timeTaken} ms
                                                    <span className="text-green-500 ml-2">
                                                        Beats {60}%
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary"
                                                    style={{ width: `${60}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-zinc-400">Memory</span>
                                                <span className="font-mono">
                                                    {failedCase?.memoryUsed} MB
                                                    <span className="text-green-500 ml-2">
                                                        Beats {65}%
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary"
                                                    style={{ width: `${65}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {status === "runtime_error" && message && (
                                <div className="space-y-4">
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                        <pre className="text-red-500 font-mono text-sm">{message}</pre>
                                    </div>
                                    {failedCase && (
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-semibold">Last Executed Input</h3>
                                            <div className="bg-zinc-800/50 rounded-lg p-4">
                                                <div className="font-mono text-sm">
                                                    {Object.keys(structuredTestCases(failedCase.input,testCaseVariableNames)).map((key) => (
                                                        <div key={key} className='bg-neutral-950 p-2 m-2 rounded'>
                                                            <p>{key} = </p>
                                                            <p>{JSON.stringify(structuredTestCases(failedCase.input,testCaseVariableNames)[key])}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            {status === "wrong_answer" && failedCase && (
                                <div className="space-y-4">
                                    <div className="grid gap-4">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Input</h3>
                                            <div className="bg-zinc-800/50 rounded-lg p-4">
                                                <pre className="font-mono text-sm">
                                                    {Object.keys(structuredTestCases(failedCase.input,testCaseVariableNames)).map((key) => (
                                                        <div key={key} className='bg-neutral-950 p-2 m-2 rounded'>
                                                            <p className="w-fix max-h-40 overflow-y-scroll">{key} = </p>
                                                            <p>{JSON.stringify(structuredTestCases(failedCase.input,testCaseVariableNames)[key])}</p>
                                                        </div>
                                                    ))}
                                                </pre>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Output</h3>
                                            <div className="bg-zinc-800/50 rounded-lg p-4">
                                                <pre className="font-mono text-sm text-red-500">
                                                    {JSON.stringify(failedCase.actualOutput)}
                                                </pre>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Expected</h3>
                                            <div className="bg-zinc-800/50 rounded-lg p-4">
                                                <pre className="font-mono text-sm text-green-500">
                                                    {JSON.stringify(failedCase.expectedOutput)}
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="code" className="p-4">
                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-2"
                                    onClick={() => navigator.clipboard.writeText(code)}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                                <pre className="bg-zinc-800/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                                    {code || "No code available"}
                                </pre>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}