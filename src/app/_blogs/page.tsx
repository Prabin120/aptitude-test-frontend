"use client"

import React, { useState } from 'react';
import RichTextEditor from '@/components/RichTextEditor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const [content, setContent] = useState(`<p>Try this rich text editor with all the new features!</p><ul><li>Headers (H1, H2, H3)</li><li>Code formatting</li><li>Text highlighting</li><li>Tables</li><li>Fullscreen mode</li></ul><pre><code class="language-javascript">// Sample JavaScript code
function helloWorld() {
  console.log("Hello, world!");
  return true;
}

// Try different languages!
// JavaScript, TypeScript, Python, Java, and more</code></pre><p>Use the dropdown in the toolbar to insert code with syntax highlighting for various languages!</p>`);
  
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Rich Text Editor Demo</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Rich Text Editor</CardTitle>
            <CardDescription>A feature-rich editor with dark mode, image uploads, tables, code highlighting, and more</CardDescription>
          </CardHeader>
          <CardContent>
            <RichTextEditor 
              value={content} 
              onChange={setContent} 
              placeholder="Start typing here..." 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Output Preview</CardTitle>
            <CardDescription>HTML output of the editor content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 p-4 rounded-md overflow-auto max-h-[300px]">
              <pre className="text-sm">{content}</pre>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Rendered Content</CardTitle>
            <CardDescription>How the content will appear when rendered</CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="prose dark:prose-invert max-w-none p-4 border rounded-md"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </CardContent>
        </Card>
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Image Upload Functionality</CardTitle>
            <CardDescription>How image upload works in this editor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none space-y-4">
              <p>
                The image upload works as follows:
              </p>
              <ol className="list-decimal pl-5">
                <li>Click the image icon in the toolbar</li>
                <li>Select an image file from your device (max size: 500KB)</li>
                <li>The image is converted to a Base64 data URL using FileReader</li>
                <li>The image is inserted at the current cursor position in the editor</li>
                <li>Images are stored as Base64 data within the HTML content (no external uploads)</li>
              </ol>
              <p className="text-amber-500">
                <strong>Note:</strong> Since images are stored as Base64 data directly in the HTML content, 
                large images will increase the size of your content. For production use, you might want to 
                implement server-side image uploads instead.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
