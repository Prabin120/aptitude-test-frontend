import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React from 'react'
import { QuestionTableProps } from '../../commonInterface';
import PaginationComponent from '@/components/pagination';
import Link from 'next/link';

const QuestionTable: React.FC<QuestionTableProps> = ({ data, totalPages, currentPage, onPageChange }) => {
    return (
        <>
            <div className="rounded-md border">
                <Table className="w-full table-fixed">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px] sm:w-[80px]">Question No</TableHead>
                            <TableHead className="w-auto">Title</TableHead>
                            <TableHead className="w-[80px] sm:w-[100px]">Type</TableHead>
                            {/* <TableHead className="w-[100px]">Acceptance</TableHead> */}
                            <TableHead className="w-[60px] sm:w-[80px]">Marks</TableHead>
                            {/* <TableHead className="w-[100px]">Frequency</TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.map((problem) => (
                            <TableRow key={problem.questionNo}>
                                <TableCell className='text-center'>
                                    {/* <Badge variant="outline" className="bg-green-100 text-green-800"> */}
                                    {problem.questionNo}.
                                    {/* </Badge> */}
                                </TableCell>
                                <TableCell>
                                    <Link href={`/aptitude/problem/${problem.slug}`} className="block truncate">
                                        {problem.title}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <div className={problem.type === "MCQ" ? "text-yellow-600" : "text-orange-700"}>{problem.type}</div>
                                </TableCell>
                                <TableCell>
                                    {problem.marks}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className='flex justify-start my-4 justify-center'>
                <PaginationComponent
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onChangePage={onPageChange}
                />
            </div>
        </>
    )
}

export default QuestionTable