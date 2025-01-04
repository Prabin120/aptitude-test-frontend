import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BrainCircuit, CircleCheck } from 'lucide-react';
import React from 'react'
import { QuestionPage } from '../../commonInterface';

interface QuestionPageProps {
    data: QuestionPage | undefined;
}

const CodeQuestion: React.FC<QuestionPageProps> = ({ data }) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>{data?._id}. {data?.title}</CardTitle>
                    <div className='flex space-x-4'>
                        {data?.userStatus === "solved"?
                            <span className='flex space-x-2 text-green-600'><CircleCheck /> Solved</span>
                        :
                        data?.userStatus === "attempted" &&
                            <span className='flex space-x-2 text-yellow-600'><BrainCircuit /> Attempted</span>
                        }
                        <Badge>{data?.difficulty}</Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[calc(100vh-200px)]">
                    <div dangerouslySetInnerHTML={{ __html: data?.description ?? "" }} />

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
