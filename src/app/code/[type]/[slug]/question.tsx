import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'

interface QuestionPage {
    _id: string;
    title: string;
    description: string;
    difficulty: string;
    tags: string[];
}

interface QuestionPageProps {
    data: QuestionPage | undefined;
}

const CodeQuestion: React.FC<QuestionPageProps> = ({ data }) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>{data?._id}. {data?.title}</CardTitle>
                    <Badge>{data?.difficulty}</Badge>
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
                </ScrollArea>
            </CardContent>
        </Card>
    );
}

export default CodeQuestion;
