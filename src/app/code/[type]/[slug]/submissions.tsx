import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React, { useState } from 'react'
import { SubmissionResultProps, SubmissionStatus } from '../../commonInterface'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import SubmissionResult from './result'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ISubmissionResultProps {
    submissions: SubmissionResultProps[]
    testCaseVariableNames: string
    aiFeedback: () => void
}

function Submissions({ submissions, testCaseVariableNames, aiFeedback }: Readonly<ISubmissionResultProps>) {
    const [selectedSubmission, setSelectedSubmission] = useState<number>(0)
    const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false)

    function getStatus(submission: SubmissionResultProps): SubmissionStatus {
        if (!submission) return "runtime_error"; // Default fallback
        if (submission.status === "Accepted") return "accepted";
        if (submission.status === "Wrong Answer") return "wrong_answer";
        if (submission.status === "Runtime Error") return "runtime_error";

        // Fallback for old data or if status is missing
        if (submission.totalTestCases && submission.passedTestCases === submission.totalTestCases) {
            return "accepted"
        } else if (submission.failedCase) {
            return "wrong_answer"
        } else {
            return "runtime_error"
        }
    }

    return (
        <ScrollArea className="h-[calc(100vh-120px)]">
            <Table className='px-4'>
                <TableHeader>
                    <TableRow className='h-10'>
                        <TableHead>#</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Language</TableHead>
                        <TableHead>Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {submissions?.map((submission, index) => (
                        <TableRow key={index + 1} onClick={() => { setSelectedSubmission(index); setIsResultModalOpen(true) }}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                                {getStatus(submission) === "accepted" ?
                                    <div className='text-green-500'>Accepted</div>
                                    :
                                    getStatus(submission) === "runtime_error" ?
                                        <div className='text-red-500'>Runtime Error</div>
                                        :
                                        <div className='text-red-500'>Wrong Answer</div>
                                }
                            </TableCell>
                            <TableCell>{submission.language}</TableCell>
                            <TableCell>{submission.createdAt ? new Date(submission.createdAt).toLocaleString() : "-"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Dialog open={isResultModalOpen} onOpenChange={setIsResultModalOpen}>
                <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>Submission Result</DialogTitle>
                    </DialogHeader>
                    {submissions && submissions.length > 0 && (
                        <SubmissionResult
                            status={getStatus(submissions[selectedSubmission])}
                            passedTestCases={submissions[selectedSubmission]?.passedTestCases ?? 0}
                            totalTestCases={submissions[selectedSubmission]?.totalTestCases}
                            // runtimeMs={submissionResult.runtimeMs}
                            // memoryMb={submissionResult.memoryMb}
                            // runtimePercentile={submissionResult.runtimePercentile}
                            // memoryPercentile={submissionResult.memoryPercentile}
                            code={submissions[selectedSubmission]?.code}
                            message={submissions[selectedSubmission]?.message}
                            failedCase={submissions[selectedSubmission]?.failedCase}
                            testCaseVariableNames={testCaseVariableNames}
                            aiFeedback={aiFeedback}
                            type="code"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </ScrollArea>
    )
}

export default Submissions