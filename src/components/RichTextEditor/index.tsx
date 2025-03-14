"use client"

import React, { useCallback, useEffect, useState } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Toggle } from '@/components/ui/toggle';
import { lowlight } from 'lowlight';
import { cn } from '@/lib/utils';
import Toolbar from './toolbar';
import './styles.css';

// Import common languages for syntax highlighting
import 'highlight.js/styles/atom-one-dark.css';

// Create a custom image extension with resizing capability
const ResizableImageExtension = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: null,
                renderHTML: attributes => {
                    if (!attributes.width) {
                        return {};
                    }
                    return {
                        width: attributes.width,
                        style: `width: ${attributes.width}px`,
                    };
                },
            },
            height: {
                default: null,
                renderHTML: attributes => {
                    if (!attributes.height) {
                        return {};
                    }
                    return {
                        height: attributes.height,
                        style: `height: ${attributes.height}px`,
                    };
                },
            },
        };
    },
    addNodeView() {
        return ({ node, editor, getPos }) => {
            const dom = document.createElement('div');
            dom.classList.add('editor-image-resizer');

            const img = document.createElement('img');
            img.src = node.attrs.src;
            img.alt = node.attrs.alt || '';
            img.className = node.attrs.class || 'editor-image';
            if (node.attrs.width) {
                img.style.width = `${node.attrs.width}px`;
            }
            if (node.attrs.height) {
                img.style.height = `${node.attrs.height}px`;
            }
            dom.appendChild(img);

            if (!editor.isEditable) {
                return {
                    dom,
                };
            }

            // Add resize handles
            const handles = ['tl', 'tr', 'bl', 'br'];
            let startX: number, startWidth: number, startHeight: number;
            // startY: number, 
            let currentHandle: string | null = null;
            let resizing = false;

            handles.forEach(handle => {
                const handleElement = document.createElement('div');
                handleElement.classList.add('editor-image-resizer__handle', `editor-image-resizer__handle-${handle}`);
                handleElement.addEventListener('mousedown', (e: MouseEvent) => {
                    e.preventDefault();
                    currentHandle = handle;
                    startX = e.clientX;
                    // startY = e.clientY;
                    startWidth = img.clientWidth;
                    startHeight = img.clientHeight;
                    resizing = true;

                    const onMouseMove = (e: MouseEvent) => {
                        if (!resizing) return;

                        e.preventDefault();

                        const dx = e.clientX - startX;
                        // const dy = e.clientY - startY;

                        const aspectRatio = startWidth / startHeight;
                        let newWidth = startWidth;
                        let newHeight = startHeight;

                        if (currentHandle?.includes('r')) {
                            // Right handles
                            newWidth = startWidth + dx;
                        } else {
                            // Left handles
                            newWidth = startWidth - dx;
                        }

                        // Maintain aspect ratio
                        newHeight = newWidth / aspectRatio;

                        img.style.width = `${newWidth}px`;
                        img.style.height = `${newHeight}px`;
                    };

                    const onMouseUp = () => {
                        if (resizing) {
                            resizing = false;
                            if (typeof getPos === 'function') {
                                editor.commands.command(({ tr }) => {
                                    tr.setNodeMarkup(getPos(), undefined, {
                                        ...node.attrs,
                                        width: img.clientWidth,
                                        height: img.clientHeight,
                                    });
                                    return true;
                                });
                            }
                        }
                        document.removeEventListener('mousemove', onMouseMove);
                        document.removeEventListener('mouseup', onMouseUp);
                    };

                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', onMouseUp);
                });
                dom.appendChild(handleElement);
            });

            return {
                dom,
                update: (updatedNode) => {
                    if (updatedNode.attrs.src !== node.attrs.src) {
                        img.src = updatedNode.attrs.src;
                    }
                    if (updatedNode.attrs.width) {
                        img.style.width = `${updatedNode.attrs.width}px`;
                    }
                    if (updatedNode.attrs.height) {
                        img.style.height = `${updatedNode.attrs.height}px`;
                    }
                    return true;
                }
            };
        };
    },
});


interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const RichTextEditor = ({
    value,
    onChange,
    placeholder = 'Write something...',
    className
}: RichTextEditorProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false, // Disable the default code block to use our custom one
            }),
            Placeholder.configure({
                placeholder,
                showOnlyWhenEditable: true,
            }),
            ResizableImageExtension.configure({
                allowBase64: true,
                HTMLAttributes: {
                    class: 'editor-image',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'editor-link',
                },
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right'],
            }),
            Highlight.configure({
                multicolor: true,
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'editor-table',
                },
            }),
            TableRow,
            TableHeader,
            TableCell,
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    class: 'editor-code-block',
                },
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
        editorProps: {
            attributes: {
                class: cn(
                    'editor-content prose dark:prose-invert max-w-none p-4 focus:outline-none min-h-[150px]',
                    isFocused ? 'editor-focused' : ''
                ),
            },
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
          editor.commands.setContent(value || '')
        }
      }, [value, editor])  // <-- This is the critical fix

    // Handle file upload
    const handleImageUpload = useCallback(async (file: File) => {
        if (!editor) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            e.preventDefault();
            if (e.target?.result && typeof e.target.result === 'string') {
                editor.chain().focus().setImage({ src: e.target.result }).run();
            }
        };
        reader.readAsDataURL(file);
    }, [editor]);

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    if (!editor) {
        return null;
    }

    return (
        <div className={cn(
            'rich-text-editor border border-input rounded-md bg-background overflow-hidden transition-all',
            isFocused ? 'ring-2 ring-ring ring-offset-2 ring-offset-background' : '',
            isFullscreen ? 'fixed inset-0 z-50 rounded-none border-0' : '',
            className
        )}>
            <Toolbar
                editor={editor}
                onImageUpload={handleImageUpload}
                isFullscreen={isFullscreen}
                onToggleFullscreen={toggleFullscreen}
            />

            {editor && (
                <BubbleMenu
                    editor={editor}
                    tippyOptions={{ duration: 150 }}
                    className="bg-popover text-popover-foreground rounded-md shadow-md overflow-hidden border border-border flex"
                >
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('bold')}
                        onPressedChange={() => editor.chain().focus().toggleBold().run()}
                        className="rounded-none px-3"
                        aria-label="Bold"
                    >
                        <span className="font-bold">B</span>
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('italic')}
                        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                        className="rounded-none px-3"
                        aria-label="Italic"
                    >
                        <span className="italic">I</span>
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('link')}
                        onPressedChange={() => {
                            const url = window.prompt('URL')
                            if (url) {
                                editor.chain().focus().setLink({ href: url }).run()
                            } else {
                                editor.chain().focus().unsetLink().run()
                            }
                        }}
                        className="rounded-none px-3"
                        aria-label="Link"
                    >
                        <span className="underline">Link</span>
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('highlight')}
                        onPressedChange={() => {
                            if (editor.can().toggleMark('highlight')) {
                                editor.chain().focus().toggleMark('highlight').run();
                            }
                        }}
                        className="rounded-none px-3"
                        aria-label="Highlight"
                    >
                        <span className="bg-yellow-200 text-black px-1">H</span>
                    </Toggle>
                </BubbleMenu>
            )}

            <div className={cn(
                isFullscreen ? 'overflow-auto h-[calc(100vh-48px)]' : ''
            )}>
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};

export default RichTextEditor;
