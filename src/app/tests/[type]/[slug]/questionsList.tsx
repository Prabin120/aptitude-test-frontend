import { Button } from '@/components/ui/button'
import { getTestsEndpoint, submitTestEndpoint } from '@/consts'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { handleGetMethod, handlePostMethod } from '@/utils/apiCall'
import { checkAuthorization } from '@/utils/authorization'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { clearAptiTestState } from '@/redux/testAnswers/aptiAnswers'
import { clearCodingTestState } from '@/redux/testAnswers/codingAnswers'
import Loading from '@/app/loading'

interface IAptiQuestion {
    _id: string
    slug: string
    title: string
    type: "MCQ" | "MAQ"
    questionKind: string
}

interface ICodingQuestion {
    _id: string;
    slug: string;
    title: string;
    questionKind: string;
}

function QuestionsList({ slug }: Readonly<{ type: string, slug: string }>) {
    const [aptitudeQuestions, setAptiQuestions] = useState<IAptiQuestion[]>([]);
    const [codeQuestions, setCodingQuestions] = useState<ICodingQuestion[]>([]);
    const [marks, setMarks] = useState<{ apti: [string], code: [string] }>()
    const [remainingQuestions, setRemainingQuestions] = useState(0)
    const [testId, setTestId] = useState('')
    const [timer, setTimer] = useState('')
    const dispatch = useAppDispatch();
    const [timeLeft, setTimeLeft] = useState("20000") // 1 hour in seconds
    const router = useRouter();
    const aptitudeAnswers = useAppSelector((state) => state.aptitude.questions)
    const codingAnswers = useAppSelector((state)=> state.coding.questions)
    
    useEffect(() => {
        setRemainingQuestions(aptitudeAnswers.length + codingAnswers.length);        
        (async () => {
            try {
                const response = await handleGetMethod(getTestsEndpoint + `/${slug}`);
                if (response instanceof Response) {
                    await checkAuthorization(response, dispatch, router, true);
                    const responseData = await response.json();
                    if (response.status === 200 || response.status === 201) {
                        const { test, codingQuestions, aptiQuestions } = responseData;
                        setCodingQuestions(codingQuestions);
                        setAptiQuestions(aptiQuestions);
                        setTestId(test._id)
                        setMarks({ code: test.codingMarks.split(",").map((d: string) => d.trim()), apti: test.aptiMarks.split(",").map((d: string) => d.trim()) })
                        setTimeLeft(test.endDateTime);
                    }
                }
            } catch (error) {
                console.error("API error:", error);
            }
        })();
    }, [dispatch, router, slug, aptitudeAnswers.length, codingAnswers.length]);

    const handleEndTest = async( timeRemain?: boolean ) => {
        if ((remainingQuestions < aptitudeQuestions.length + codeQuestions.length) && timeRemain) {
            if(!confirm(`You have ${aptitudeQuestions.length + codeQuestions.length - remainingQuestions} questions remaining. Are you sure you want to end the test? Remember, once the time runs out, your answes will automatically submitted.`))
                return;
        }
        try {
            const response = await handlePostMethod(submitTestEndpoint, {aptitudeAnswers: aptitudeAnswers, codingAnswers: codingAnswers, testId: testId });
            if(response instanceof Response){
                await checkAuthorization(response, dispatch, router, true);
                const responseData = await response.json();
                if (response.status === 200 || response.status === 201) {
                    dispatch(clearAptiTestState());
                    dispatch(clearCodingTestState());
                    router.replace("/thank-you");
                    return;
                }
                else{
                    alert(responseData.message);
                    router.replace("/tests")
                    return
                }
            } else{
                alert(response.message);
                router.replace("/tests")
                return
            }
        } catch (error) {
            alert(error);
        }
    }

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date()
            const testTime = new Date(timeLeft)
            const time = testTime.getTime() - now.getTime()
            if (time <= 0) {
                handleEndTest(false)
                return
            }
            const hours = Math.floor((time / (1000 * 60 * 60)) % 24)
            const minutes = Math.floor((time / (1000 * 60)) % 60)
            const seconds = Math.floor((time / 1000) % 60)
            setTimer(`${hours}h ${minutes}m ${seconds}s`)
        }
        calculateTimeLeft()
        const interval = setInterval(calculateTimeLeft, 1000)
        return () => clearInterval(interval)
    }, [timeLeft])

    if(aptitudeQuestions.length === 0 && codeQuestions.length === 0) {
        return (
            <Loading/>
        )
    }

    return (
        <div>
            <header className="sticky top-0 bg-background z-10 p-4 border-b">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-lg font-semibold">Time Left: {timer}</div>
                    <div className="text-lg font-semibold">
                        Questions: {remainingQuestions}/{codeQuestions.length + aptitudeQuestions.length}
                    </div>
                    <Button variant="destructive" onClick={() => handleEndTest(true)}>Submit</Button>
                </div>
            </header>
            <div className='container mx-auto py-10'>
                <h2 className='text-2xl mb-2'>Aptitute Questions</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Status</TableHead>
                            <TableHead className="w-[100px]">Question No</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="w-[100px]">Type</TableHead>
                            <TableHead className="w-[100px]">Marks</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {aptitudeQuestions?.map((problem, index) => (
                            <TableRow key={index + 1} >
                                <TableCell>
                                    {aptitudeAnswers.findIndex((ans) => ans.questionNo === problem._id) !== -1 
                                    ? <Button variant={"secondary"} disabled className='bg-green-600'>Done</Button>
                                    : <Button variant={"secondary"} disabled className='bg-red-600'>Not Done</Button>
                                    }
                                </TableCell>
                                <TableCell className='text-center'>
                                    {index + 1}.
                                </TableCell>
                                <TableCell>
                                    <Link href={`/apti-zone/exam/${slug}/test/`+ "?time="+timeLeft}>
                                        {problem.title}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <div className={problem.type === "MCQ" ? "text-yellow-600" : "text-orange-700"}>{problem.type}</div>
                                </TableCell>
                                <TableCell>
                                    {marks?.apti[index]}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <h2 className='text-2xl mt-4 mb-2'>Coding Questions</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Status</TableHead>
                            <TableHead className="w-[100px]">Question No</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="w-[100px]">Marks</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {codeQuestions?.map((problem, index) => (
                            <TableRow key={index + 1} >
                                <TableCell>
                                    {codingAnswers.findIndex((ans) => ans.questionNo === problem._id) !== -1 
                                    ? <Button variant={"secondary"} disabled className='bg-green-600'>Done</Button>
                                    : <Button variant={"secondary"} disabled className='bg-red-600'>Not Done</Button>
                                    }
                                </TableCell>
                                <TableCell className='text-center'>
                                    {index + 1}.
                                    {/* </Badge> */}
                                </TableCell>
                                <TableCell>
                                    {codingAnswers.findIndex((ans) => ans.questionNo === problem._id) !== -1 
                                    ?
                                    problem.title
                                    :
                                    <Link href={`/code/exam/${problem.slug}`+ "?time="+timeLeft}>
                                        {problem.title}
                                    </Link>
                                }
                                </TableCell>
                                <TableCell>
                                    {marks?.code[index]}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default QuestionsList