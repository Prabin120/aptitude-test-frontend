"use client"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getQuestionsToReview, sendQuesionRejectedMail, sendQuestionApprovedMail, updateQuestionStatus } from '@/consts'
import { useEffect, useState } from 'react';
import { handleGetMethod, handlePostMethod } from '@/utils/apiCall'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

interface Question {
    questionNo: number
    slug: string
    title: string
    difficulty: string
    status: string
    donatedBy: {
        name: string,
        username: string
    }
}

function CreatorsQuestions() {
    const [questionsData, setQuestionsData] = useState<Question[]>();
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [feedback, setFeedback] = useState<string>("");
    const [index, setIndex] = useState<number>(-1);
    
    useEffect(() => {
        const fetchQuestions = async () => {
            setError("");
            setLoading(true);
            try {
                const response = await handleGetMethod(getQuestionsToReview);
                if(response instanceof Response) {
                    const res = await response.json();
                    if(response.status === 200 || response.status === 201) {
                        setQuestionsData(res.data);
                        setError("");
                    } else {
                        console.error(res.message);
                        setError(res.message);
                    }
                } else {
                    setError(response.message);
                }
            } catch (error) {
                console.error("Error fetching questions:", error);
                setError("Error fetching questions");
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const handleRejectQuestion = async () => {
        setLoading(true);
        const question = questionsData?.at(index);
        if(!question) {
            setLoading(false);
            alert("Question not found");
            return
        }
        const response = await handlePostMethod(updateQuestionStatus, {
            questionNo: questionsData?.at(index)?.questionNo,
            status: "invalid",
            username: question?.donatedBy.username
        })
        if(response instanceof Response) {
            const res = await response.json();
            if(response.status === 200 || response.status === 201) {
                setQuestionsData(prevQuestions => 
                    prevQuestions?.map((q, i) => 
                        i === index ? { ...q, status: "invalid" } : q
                    )
                );
                const mailStatus = await handlePostMethod(sendQuesionRejectedMail, {
                    username: question?.donatedBy.username,
                    questionNo: question?.questionNo,
                    questionTitle: question?.title,
                    feedback: feedback
                })
                if(mailStatus instanceof Response) {
                    const mailRes = await mailStatus.json();
                    if(mailStatus.status === 200 || mailStatus.status === 201) {
                        alert("Rejection mail sent successfully");
                        setError("");
                        setFeedback("");
                    } else {
                        console.error(mailRes.message);
                        setError(mailRes.message);
                    }
                } else {
                    setError(mailStatus.message);
                }
            } else {
                console.error(res.message);
                setError(res.message);
            }
        } else {
            setError(response.message);
        }
        setIsModalOpen(false);
        setLoading(false);
    }

    const handleApprove = async (index: number) => {
        const consent = confirm("Are you sure you want to approve this question?");
        if(!consent) {
            return;
        }
        setLoading(true);
        const question = questionsData?.at(index);
        if(!question) {
            setLoading(false);
            alert("Question not found");
            return;
        }
        if(!question.donatedBy.username || !question.questionNo || !question.title || !question.difficulty) {
            setLoading(false);
            alert("donatedBy, questionNo, title or type is missing");
            return;
        }
        const response = await handlePostMethod(updateQuestionStatus, {
            questionNo: questionsData?.at(index)?.questionNo,
            status: "live",
            username: question?.donatedBy.username
        })
        if(response instanceof Response) {
            const res = await response.json();
            if(response.status === 200 || response.status === 201) {
                setQuestionsData(prevQuestions => 
                    prevQuestions?.map((q, i) => 
                        i === index ? { ...q, status: "live" } : q
                    )
                );
                const mailStatus = await handlePostMethod(sendQuestionApprovedMail, {
                    username: question?.donatedBy.username,
                    questionNo: question?.questionNo,
                    questionTitle: question?.title,
                    questionType: question?.difficulty
                })
                if(mailStatus instanceof Response) {
                    const mailRes = await mailStatus.json();
                    if(mailStatus.status === 200 || mailStatus.status === 201) {
                        alert("Approval mail sent successfully");
                        setError("");
                        setFeedback("");
                    } else {
                        console.error(mailRes.message);
                        setError(mailRes.message);
                    }
                } else {
                    setError(mailStatus.message);
                }
            } else {
                console.error(res.message);
                setError(res.message);
            }
        } else {
            setError(response.message);
        }
        setLoading(false);
    }

    const handleReject = async (index: number) => {
        setIndex(index);
        setIsModalOpen(true);
    }
    
    const renderQuestions = (questions: Question[]) => (
        <Table className="border">
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Preview</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {questions.map((question, index) => (
                    <TableRow key={question.questionNo}>
                        <TableCell>{question.questionNo}</TableCell>
                        <TableCell>{question.title}</TableCell>
                        <TableCell>{question.status}</TableCell>
                        <TableCell>
                            {question.status !== 'live' && (
                                <Link href={`/admin/code/modify-question/${question.slug}/?type=review`}>
                                    <Button variant="outline" size="sm" className="mr-2">Preview</Button>
                                </Link>
                            )}
                        </TableCell>
                        <TableCell className='flex gap-2'>
                            <Button type='button' onClick={() => handleApprove(index)} size={"sm"} className='bg-green-600'>Aprove</Button>
                            <Button type='button' onClick={() => handleReject(index)} size={"sm"} className='bg-red-600'>Reject</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label="Insert Table"
                    >
                        <Table className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Give a Review</DialogTitle>
                        <DialogDescription>Give a review for what reason the question is rejected.</DialogDescription>
                        <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)}></Textarea>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" onClick={handleRejectQuestion}>Send</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Table>
    )

    if (loading) {
        return <div className='flex justify-center items-center h-screen'>Loading...</div>;
    }

    if (error) {
        return <div className='flex justify-center items-center h-screen'>{error?? "Error fetching questions"}</div>;
    }

    if (!questionsData) {
        return <div className='flex justify-center items-center h-screen'>No questions found</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Manage Questions</h1>
            {renderQuestions(questionsData)}
        </div>
    )
}

export default CreatorsQuestions
