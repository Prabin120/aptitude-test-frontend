import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'
import React, { Dispatch, SetStateAction } from 'react'
import { Problem } from '../commonInterface';
import { BrainCircuit, CircleCheck } from 'lucide-react';
import PaginationComponent from '@/components/pagination';

interface QuestionTableProps {
    filteredProblems: Problem[] | undefined;
    totalPages: number
    currentPage: number
    setCurrentPage: Dispatch<SetStateAction<number>>
}

const QuestionTable: React.FC<QuestionTableProps> = ({ filteredProblems, totalPages, currentPage, setCurrentPage }: QuestionTableProps) => {
    return (
        <>
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
                    <TableRow key={problem.questionNo} >
                        <TableCell>
                            {problem.userStatus === "solved"?
                                <Badge variant="outline" className="text-green-800">
                                    <CircleCheck />
                                </Badge>
                            :
                            problem.userStatus === "attempted" &&
                                <Badge variant="outline" className="text-yellow-800">
                                    <BrainCircuit />
                                </Badge>
                            }
                        </TableCell>
                        <TableCell>
                            <Link href={`/code/problems/${problem.slug}`}>
                                {problem.questionNo}. {problem.title}
                            </Link>
                        </TableCell>
                        <TableCell>
                            {problem.solution && (
                                <svg className="w-5 h-5 text-blue-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            )}
                        </TableCell>
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
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        <PaginationComponent
            totalPages={totalPages}
            currentPage={currentPage}
            onChangePage={setCurrentPage}
        />
        </>
    )
}

export default QuestionTable