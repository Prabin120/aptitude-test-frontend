"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { groupTestExamReport } from '@/consts';
import { handleGetMethod } from '@/utils/apiCall';
import { useEffect, useState } from 'react';

interface IAptitudeQuestion {
    name: string
    marksAchieved: string;
}

const ExamScore = ({ testId }: { testId: string }) => {
    const [data, setData] = useState<IAptitudeQuestion[]>([]);
    try {
        useEffect(() => {
            (async () => {
                const res = await handleGetMethod(groupTestExamReport + "/" + testId);
                if (res instanceof Response) {
                    const data = await res.json();
                    setData(data.data);
                } else {
                    alert(res.message);
                }
            })();
        }, [testId]);
    } catch (error) {
        alert(error)
    }
    return (
        <div className='max-w-3xl m-auto min-h-[80vh]'>
            <h1 className='text-3xl mb-6 mt-8'>Exam Score</h1>
            <Table className='text-center'>
                <TableHeader>
                    <TableRow>
                        <TableHead className='text-center'>Rank</TableHead>
                        <TableHead className='text-center'>Name</TableHead>
                        <TableHead className='text-center'>Score</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((problem, index) => (
                        <TableRow key={index + 1} >
                            <TableCell>
                                {index + 1}
                            </TableCell>
                            <TableCell>
                                {problem.name}
                            </TableCell>
                            <TableCell>
                                {problem.marksAchieved}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
export default ExamScore;