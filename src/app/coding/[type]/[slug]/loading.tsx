import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

function Loading() {
    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="rounded-lg border">
            <ResizablePanel defaultSize={50}>
                <Skeleton className="h-full w-full" />
            </ResizablePanel>
            <ResizableHandle />
            {/* Code editor and results column */}
            <ResizablePanel defaultSize={50}>
                <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={60}>
                        {/* Code editor */}
                        <Skeleton className="h-full w-full" />
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel defaultSize={40}>
                        {/* Test cases and results */}
                        <Skeleton className="h-full w-full" />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}

export default Loading