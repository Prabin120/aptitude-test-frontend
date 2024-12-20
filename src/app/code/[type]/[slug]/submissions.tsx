import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React, { useState } from 'react'
import { SubmissionResultProps, SubmissionStatus } from '../../commonInterface'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import SubmissionResult from './result'

interface ISubmissionResultProps {
    submissions: SubmissionResultProps[]
    testCaseVariableNames: string
}

function Submissions({ submissions, testCaseVariableNames }: Readonly<ISubmissionResultProps>) {
    const [selectedSubmission, setSelectedSubmission] = useState<number>(0)
    const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false)
    function checkStatus(){
        let status: SubmissionStatus;
        if (submissions[selectedSubmission]?.totalTestCases && submissions[selectedSubmission]?.passedTestCases === submissions[selectedSubmission]?.totalTestCases) {
            status = "accepted"
        } else if (submissions[selectedSubmission]?.failedCase) {
            status = "wrong_answer"
        } else {
            status = "runtime_error"
        }
        return status
    }
    return (
        <>
            <Table className='px-4'>
                <TableHeader>
                    <TableRow className='h-10'>
                        <TableHead>#</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Language</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {submissions?.map((submission, index) => (
                        <TableRow key={index+1} onClick={() => {setSelectedSubmission(index); setIsResultModalOpen(true)}}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                                {submission.passedTestCases === submission.totalTestCases ?
                                    <div className='text-green-500'>Accepted</div>
                                    :
                                    <div className='text-red-500'>Wrong Answer</div>
                                }
                            </TableCell>
                            <TableCell>{submission.language}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Dialog open={isResultModalOpen} onOpenChange={setIsResultModalOpen}>
                <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>Submission Result</DialogTitle>
                    </DialogHeader>
                    {submissions && (
                        <SubmissionResult
                            status={checkStatus()}
                            passedTestCases={submissions[selectedSubmission]?.passedTestCases??0}
                            totalTestCases={submissions[selectedSubmission]?.totalTestCases}
                            // runtimeMs={submissionResult.runtimeMs}
                            // memoryMb={submissionResult.memoryMb}
                            // runtimePercentile={submissionResult.runtimePercentile}
                            // memoryPercentile={submissionResult.memoryPercentile}
                            code={submissions[selectedSubmission]?.code}
                            message={submissions[selectedSubmission]?.message}
                            failedCase={submissions[selectedSubmission]?.failedCase}
                            testCaseVariableNames = {testCaseVariableNames}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Submissions