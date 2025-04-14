"use client"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getAdminCodeQuestions } from '@/consts'
import { useEffect, useState } from 'react';
import { handleGetMethod } from '@/utils/apiCall'

interface Question {
    _id: number
    slug: string
    title: string
    type: string
    status: string
}

function AdminQuestions() {
    const [questionsData, setQuestionsData] = useState<Question[]>();
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const response = await handleGetMethod(getAdminCodeQuestions);
                // const response = await axios.get(codeCompileApiEntryPoint + getAdminCodeQuestions);
                if(response instanceof Response) {
                    const res = await response.json();
                    if(response.status === 200 || response.status === 201) {
                        console.log(res);
                        setQuestionsData(res.data);
                    } else {
                        console.error(res.message);
                        setError(res.message);
                    }
                } else {
                    setError(response.message);
                }
                // const data = await response.json();
                // setQuestionsData(data);
            } catch (error) {
                console.error("Error fetching questions:", error);
                setError("Error fetching questions");
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);
    
    const renderQuestions = (questions: Question[]) => (
        <Table className="border">
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {questions.map((question) => (
                    <TableRow key={question._id}>
                        <TableCell>{question._id}</TableCell>
                        <TableCell>{question.title}</TableCell>
                        <TableCell>{question.type}</TableCell>
                        <TableCell>{question.status}</TableCell>
                        <TableCell>
                            {question.status !== 'live' && (
                                <Link href={`admin/code/modify-question/${question.slug}`}>
                                    <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                                </Link>
                            )}
                            {question.status === 'rejected' && (
                                <Button variant="outline" size="sm">Resend</Button>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
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
            {/* <Tabs defaultValue="code">
                <TabsList>
                    <TabsTrigger value="code">Code</TabsTrigger>
                    <TabsTrigger value="aptitude">Aptitude</TabsTrigger>
                </TabsList>
                <TabsContent value="code"> */}
                    <div className="mb-4 flex justify-end">
                        <Link href="admin/code/add-question">
                            <Button>Add Code Question</Button>
                        </Link>
                    </div>
                    {renderQuestions(questionsData)}
                {/* </TabsContent>
                <TabsContent value="aptitude">
                    <div className="mb-4 flex justify-end">
                        <Link href="admin/apti/add-question">
                            <Button>Add Aptitude Question</Button>
                        </Link>
                    </div>
                    {renderQuestions(questionsData.aptitude)}
                </TabsContent>
            </Tabs> */}
        </div>
    )
}

export default AdminQuestions
