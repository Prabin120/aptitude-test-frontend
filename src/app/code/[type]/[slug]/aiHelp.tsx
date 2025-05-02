import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton"
import MarkdownPreview from '@uiw/react-markdown-preview';

// Interface for the AiHelp component
interface AiHelpProps {
    aihelpText: string; // Expecting the response to be a markdown string
}

const AiHelp: React.FC<AiHelpProps> = ({ aihelpText }) => {
    // const value = aihelpText;
    if (aihelpText?.length === 0)
        return (
            <div className="space-y-4 h-full p-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-4/5" />
                <Skeleton className="h-6 w-3/5" />
                <Skeleton className="h-6 w-3/4" />
            </div>
        )
    return (
        <div className='p-4 h-full'>
            <h1 className="text-2xl font-bold mb-4">Smart AC</h1>
            <ScrollArea className="h-[calc(100vh-200px)]">
                <MarkdownPreview source={aihelpText} />
            </ScrollArea>
        </div>
    );
};

export default AiHelp;
