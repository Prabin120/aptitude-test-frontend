import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BrainCircuit, CircleCheck } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { QuestionPage } from '../../commonInterface';
import "@/components/RichTextEditor/styles.css"

interface QuestionPageProps {
    data: QuestionPage | undefined;
    type: string
}

const CodeQuestion: React.FC<QuestionPageProps> = ({ data, type }) => {
    const [desc, setDesc] = useState<string>("")
    useEffect(()=>{
        data && (async()=>{
            const response = await fetch(data?.description)
            const res = await response.text();
            setDesc(res)
        })()
    },[])
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>{data?._id}. {data?.title}</CardTitle>
                    { type !== "exam" &&
                        <div className='flex space-x-4 items-center'>
                            {data?.userStatus === "solved"?
                                <span className='flex space-x-2 text-green-600 text-sm'><CircleCheck size={16}/> Solved</span>
                            :
                            data?.userStatus === "attempted" &&
                                <span className='flex space-x-2 text-yellow-600 text-sm'><BrainCircuit size={16}/> Attempted</span>
                            }
                            <Badge>{data?.difficulty}</Badge>
                        </div>
                    }
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[calc(100vh-200px)]">
                    <div 
                        className="prose dark:prose-invert max-w-none p-4 border rounded-md"
                        dangerouslySetInnerHTML={{ __html: desc }}
                    />
                    <h3 className="text-lg font-bold mt-6 mb-2">Tags</h3>
                    {data?.tags ? data.tags.map((tag) => (
                        <React.Fragment key={tag}>
                            <Badge>{tag}</Badge>
                            <small className='pr-2'></small>
                        </React.Fragment>
                    )) : ""}
                    <p className='mt-4 text-sm text-right px-4'>Donated By: {data?.donatedBy.name}</p>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}

export default CodeQuestion;
