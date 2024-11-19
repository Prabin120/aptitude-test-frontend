import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'
import React from 'react'
import { Problem } from '../commonInterface';

interface QuestionTableProps {
    filteredProblems: Problem[] | undefined;
}

const QuestionTable: React.FC<QuestionTableProps> = ({ filteredProblems }) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="w-[100px]">Solution</TableHead>
                    {/* <TableHead className="w-[100px]">Acceptance</TableHead> */}
                    <TableHead className="w-[100px]">Difficulty</TableHead>
                    {/* <TableHead className="w-[100px]">Frequency</TableHead> */}
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredProblems?.map((problem) => (
                    <TableRow key={problem._id} >
                        <TableCell>
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                                Done
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Link href={`/code/problems/${problem.slug}`}>
                                {problem._id}. {problem.title}
                            </Link>
                        </TableCell>
                        <TableCell>
                            {problem.solution && (
                                <svg className="w-5 h-5 text-blue-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            )}
                        </TableCell>
                        {/* <TableCell>{problem.acceptance.toFixed(1)}%</TableCell> */}
                        <TableCell>
                            <Badge
                                variant="outline"
                                className={
                                    problem.difficulty === "Easy"
                                        ? "bg-green-100 text-green-800"
                                        : problem.difficulty === "Medium"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                }
                            >
                                {problem.difficulty}
                            </Badge>
                        </TableCell>
                        {/* <TableCell>
                {problem.isFrequencyLocked && (
                  <svg className="w-5 h-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                )}
              </TableCell> */}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default QuestionTable