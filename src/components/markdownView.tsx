import React from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
export default function MarkdownView({data}: {data: string}) {
    return (
        <MarkdownPreview source={data}/>
    )
}