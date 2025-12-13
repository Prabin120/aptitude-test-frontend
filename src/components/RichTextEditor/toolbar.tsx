
import React, { useRef, useState } from 'react';
import { Editor } from '@tiptap/react';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Image as ImageIcon,
    Link as LinkIcon,
    Undo,
    Redo,
    Code,
    Heading1,
    Heading2,
    Heading3,
    Table,
    Highlighter,
    Maximize2,
    Minimize2
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
    DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface ToolbarProps {
    editor: Editor;
    onImageUpload: (file: File) => void;
    isFullscreen: boolean;
    onToggleFullscreen: () => void;
    isSourceMode: boolean;
    onToggleSourceMode: () => void;
}

const Toolbar = ({ editor, onImageUpload, isFullscreen, onToggleFullscreen, isSourceMode, onToggleSourceMode }: ToolbarProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [rows, setRows] = useState<number>(3);
    const [cols, setCols] = useState<number>(3);
    const [withHeaderRow, setWithHeaderRow] = useState<boolean>(true);

    const handleImageButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (500KB = 500 * 1024 bytes)
            if (file.size > 500 * 1024) {
                toast.error("File too large. Please select an image smaller than 500KB");
                // Reset the input value so the same file can be selected again
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                return;
            }
            onImageUpload(file);
        }
        // Reset the input value so the same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleInsertTable = () => {
        if (editor.can().insertTable()) {
            editor.chain().focus().insertTable({ rows, cols, withHeaderRow }).run();
        }
    };

    // Code languages to offer
    const codeLanguages = [
        { name: 'Plain Text', value: 'text' },
        { name: 'HTML', value: 'html' },
        { name: 'CSS', value: 'css' },
        { name: 'JavaScript', value: 'javascript' },
        { name: 'TypeScript', value: 'typescript' },
        { name: 'Python', value: 'python' },
        { name: 'Java', value: 'java' },
        { name: 'C++', value: 'cpp' },
        { name: 'PHP', value: 'php' },
        { name: 'Ruby', value: 'ruby' },
        { name: 'Go', value: 'go' },
        { name: 'Rust', value: 'rust' },
        { name: 'Shell/Bash', value: 'bash' },
        { name: 'SQL', value: 'sql' },
        { name: 'JSON', value: 'json' }
    ];

    if (!editor) {
        return null;
    }

    return (
        <div className="border-b border-border bg-muted/40 flex flex-wrap items-center gap-1 p-1">
            {/* Text Formatting */}
            <div className="flex">
                <Toggle
                    size="sm"
                    pressed={editor.isActive('bold')}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                    aria-label="Bold"
                >
                    <Bold className="h-4 w-4" />
                </Toggle>

                <Toggle
                    size="sm"
                    pressed={editor.isActive('italic')}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                    aria-label="Italic"
                >
                    <Italic className="h-4 w-4" />
                </Toggle>

                <Toggle
                    size="sm"
                    pressed={editor.isActive('underline')}
                    onPressedChange={() => {
                        if (editor.can().toggleMark('underline')) {
                            editor.chain().focus().toggleMark('underline').run();
                        }
                    }}
                    aria-label="Underline"
                >
                    <Underline className="h-4 w-4" />
                </Toggle>

                <Toggle
                    size="sm"
                    pressed={editor.isActive('strike')}
                    onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                    aria-label="Strikethrough"
                >
                    <Strikethrough className="h-4 w-4" />
                </Toggle>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Headings */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8">
                        <Heading1 className="h-4 w-4 mr-1" />
                        <span>Heading</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                        <Heading1 className="h-4 w-4 mr-2" />
                        <span>Heading 1</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                        <Heading2 className="h-4 w-4 mr-2" />
                        <span>Heading 2</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                        <Heading3 className="h-4 w-4 mr-2" />
                        <span>Heading 3</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="h-6" />

            {/* Lists */}
            <div className="flex">
                <Toggle
                    size="sm"
                    pressed={editor.isActive('bulletList')}
                    onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                    aria-label="Bullet List"
                >
                    <List className="h-4 w-4" />
                </Toggle>

                <Toggle
                    size="sm"
                    pressed={editor.isActive('orderedList')}
                    onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                    aria-label="Ordered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </Toggle>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Text Alignment */}
            <div className="flex">
                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: 'left' })}
                    onPressedChange={() => {
                        if (editor.can().command(({ commands }) => {
                            return commands.setTextAlign('left');
                        })) {
                            editor.chain().focus().setTextAlign('left').run();
                        }
                    }}
                    aria-label="Align Left"
                >
                    <AlignLeft className="h-4 w-4" />
                </Toggle>

                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: 'center' })}
                    onPressedChange={() => {
                        if (editor.can().command(({ commands }) => {
                            return commands.setTextAlign('center');
                        })) {
                            editor.chain().focus().setTextAlign('center').run();
                        }
                    }}
                    aria-label="Align Center"
                >
                    <AlignCenter className="h-4 w-4" />
                </Toggle>

                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: 'right' })}
                    onPressedChange={() => {
                        if (editor.can().command(({ commands }) => {
                            return commands.setTextAlign('right');
                        })) {
                            editor.chain().focus().setTextAlign('right').run();
                        }
                    }}
                    aria-label="Align Right"
                >
                    <AlignRight className="h-4 w-4" />
                </Toggle>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Code & Highlight */}
            <div className="flex">
                <Toggle
                    size="sm"
                    pressed={editor.isActive('code')}
                    onPressedChange={() => editor.chain().focus().toggleCode().run()}
                    aria-label="Code"
                >
                    <Code className="h-4 w-4" />
                </Toggle>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8">
                            <Code className="h-4 w-4 mr-1" />
                            <span>Code Block</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="max-h-80 overflow-y-auto">
                        {codeLanguages.map((lang) => (
                            <DropdownMenuItem
                                key={lang.value}
                                onClick={() => {
                                    editor.chain().focus().toggleCodeBlock({ language: lang.value }).run();
                                }}
                            >
                                {lang.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <Toggle
                    size="sm"
                    pressed={editor.isActive('highlight')}
                    onPressedChange={() => {
                        if (editor.can().toggleMark('highlight')) {
                            editor.chain().focus().toggleMark('highlight').run();
                        }
                    }}
                    aria-label="Highlight"
                >
                    <Highlighter className="h-4 w-4" />
                </Toggle>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Table */}
            <Dialog>
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
                        <DialogTitle>Insert Table</DialogTitle>
                        <DialogDescription>Select the number of rows and columns for your table.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="rows" className="text-right">
                                Rows
                            </Label>
                            <Input
                                id="rows"
                                type="number"
                                min="1"
                                max="20"
                                value={rows}
                                onChange={(e) => setRows(parseInt(e.target.value, 10) || 2)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="cols" className="text-right">
                                Columns
                            </Label>
                            <Input
                                id="cols"
                                type="number"
                                min="1"
                                max="10"
                                value={cols}
                                onChange={(e) => setCols(parseInt(e.target.value, 10) || 2)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="header" className="text-right">
                                Include Header Row
                            </Label>
                            <div className="col-span-3 flex items-center">
                                <input
                                    id="header"
                                    type="checkbox"
                                    checked={withHeaderRow}
                                    onChange={(e) => setWithHeaderRow(e.target.checked)}
                                    className="mr-2 h-4 w-4"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button onClick={handleInsertTable}>Insert Table</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Media & Links */}
            <div className="flex">
                <Button
                    type='button'
                    variant="ghost"
                    size="icon"
                    onClick={handleImageButtonClick}
                    className="h-8 w-8"
                    aria-label="Insert Image"
                >
                    <ImageIcon className="h-4 w-4" />
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                </Button>

                <Button
                    type='button'
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        const url = window.prompt('URL')
                        if (url) {
                            editor.chain().focus().setLink({ href: url }).run()
                        }
                    }}
                    className="h-8 w-8"
                    aria-label="Insert Link"
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Undo/Redo */}
            <div className="flex">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    className="h-8 w-8"
                    aria-label="Undo"
                >
                    <Undo className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    className="h-8 w-8"
                    aria-label="Redo"
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Source Code Toggle */}
            <div className="flex">
                <Toggle
                    size="sm"
                    pressed={isSourceMode}
                    onPressedChange={onToggleSourceMode}
                    aria-label="Toggle Source Code"
                    className="gap-2"
                >
                    <Code className="h-4 w-4" />
                    <span className="text-xs font-mono">HTML</span>
                </Toggle>
            </div>

            {/* Fullscreen toggle */}
            <div className="ml-auto">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleFullscreen}
                    className="h-8 w-8"
                    type="button"
                    aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                    {isFullscreen ? (
                        <Minimize2 className="h-4 w-4" />
                    ) : (
                        <Maximize2 className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </div>
    );
};

export default Toolbar;