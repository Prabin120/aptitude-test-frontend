"use client"

// Using react-resizable-panels directly
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Editor, { Monaco } from "@monaco-editor/react";
import React, { useState, useRef, useEffect } from "react";
import { executeCode } from "../../code/apiCalls";
import { Loader2, Play, Menu, Maximize2, Minimize2, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { registerPythonCompletion } from "../utils/pythonIntellisense";
import { registerCppCompletion } from "../utils/cppIntellisense";
import { registerCCompletion } from "../utils/cIntellisense";
import { registerJavaCompletion } from "../utils/javaIntellisense";
import { registerGoCompletion } from "../utils/goIntellisense";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface CompilerEditorProps {
    language: string;
}

const languages = [
    { id: 'python', name: 'Python' },
    { id: 'cpp', name: 'C++' },
    { id: 'c', name: 'C' },
    { id: 'java', name: 'Java' },
    { id: 'go', name: 'Go' },
];

const CompilerEditor: React.FC<CompilerEditorProps> = ({ language }) => {
    // --- State ---
    const getDefaultCode = (lang: string): string => {
        switch (lang) {
            case 'python': return 'print("AptiCode is best")';
            case 'cpp': return '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "AptiCode is best" << endl;\n    return 0;\n}';
            case 'c': return '#include <stdio.h>\n\nint main() {\n    printf("AptiCode is best\\n");\n    return 0;\n}';
            case 'java': return 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("AptiCode is best");\n    }\n}';
            case 'go': return 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("AptiCode is best")\n}';
            default: return '// Write your code here';
        }
    };

    const [code, setCode] = useState<string>(getDefaultCode(language));
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [autocomplete, setAutocomplete] = useState<boolean>(true);

    // Mobile Specific State
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');
    const [fullScreenMode, setFullScreenMode] = useState<'none' | 'editor' | 'io'>('none');

    const monacoRef = useRef<Monaco | null>(null);
    const disposableRef = useRef<any>(null);
    const pathname = usePathname();

    // --- Effects ---
    useEffect(() => {
        if (!monacoRef.current || !autocomplete) {
            if (disposableRef.current) {
                disposableRef.current.dispose();
                disposableRef.current = null;
            }
            return;
        }
        const monaco = monacoRef.current;
        if (disposableRef.current) disposableRef.current.dispose();

        try {
            switch (language) {
                case 'python': disposableRef.current = registerPythonCompletion(monaco); break;
                case 'cpp': disposableRef.current = registerCppCompletion(monaco); break;
                case 'c': disposableRef.current = registerCCompletion(monaco); break;
                case 'java': disposableRef.current = registerJavaCompletion(monaco); break;
                case 'go': disposableRef.current = registerGoCompletion(monaco); break;
            }
        } catch (err) {
            console.error('Failed to register completion provider:', err);
        }
        return () => { if (disposableRef.current) disposableRef.current.dispose(); };
    }, [language, autocomplete, monacoRef.current]);

    const handleEditorDidMount = (editor: any, monaco: Monaco) => {
        monacoRef.current = monaco;
    };

    const getBackendLanguage = (lang: string) => lang === "python" ? "py" : lang;

    const handleRun = async () => {
        setLoading(true);
        setOutput("");
        setError("");
        // Switch to output tab on mobile when running
        setActiveTab('output');

        try {
            const result = await executeCode(code, getBackendLanguage(language), input);
            if (typeof result === "string") {
                setError(result);
            } else {
                setOutput(result.ActualOutput);
            }
        } catch (err) {
            setError("An error occurred while executing the code.");
        } finally {
            setLoading(false);
        }
    };

    // --- Components ---
    const RunButton = () => (
        <button
            onClick={handleRun}
            disabled={loading}
            className="bg-[rgb(147,51,234)] hover:bg-[rgb(126,34,206)] text-white px-4 md:px-6 py-1.5 rounded-full flex items-center gap-2 font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-purple-900/20 text-sm md:text-base whitespace-nowrap"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            <span className="hidden md:inline">Run Code</span>
            <span className="md:hidden">Run</span>
        </button>
    );

    const AutocompleteToggle = () => (
        <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-400 hover:text-zinc-200 transition-colors bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/50 w-full md:w-auto md:bg-transparent md:border-none md:p-0">
            <input
                type="checkbox"
                checked={autocomplete}
                onChange={(e) => setAutocomplete(e.target.checked)}
                className="w-4 h-4 accent-purple-600 rounded"
            />
            <span className="text-sm">Autocomplete</span>
        </label>
    );

    // --- Render ---
    return (
        <div className="h-full w-full flex flex-col bg-zinc-950 relative overflow-hidden">

            {/* Desktop Header */}
            <div className="hidden md:flex justify-between items-center px-4 py-2 border-b border-zinc-800 bg-zinc-950 shrink-0 h-14">
                <Link className="flex items-center justify-center" href="/">
                    <span className="font-bold text-lg">
                        <span className="font-serif font-thin">&lt;AptiCode/&gt;</span>.
                    </span>
                </Link>
                <div className="absolute left-1/2 -translate-x-1/2">
                    <RunButton />
                </div>
                <div className="flex items-center gap-4">
                    <AutocompleteToggle />
                </div>
            </div>

            {/* Mobile Header */}
            <div className="flex md:hidden justify-between items-center px-4 py-2 border-b border-zinc-800 bg-zinc-950 shrink-0 h-14 z-20">
                <Link className="flex items-center justify-center" href="/">
                    <span className="font-bold text-lg">
                        <span className="font-serif font-thin">&lt;AptiCode/&gt;</span>.
                    </span>
                </Link>
                <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2 text-zinc-400 hover:text-white">
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Menu Drawer */}
            <div className={cn(
                "fixed inset-0 bg-black/80 z-50 backdrop-blur-sm transition-opacity md:hidden",
                mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )} onClick={() => setMobileMenuOpen(false)}>
                <div className={cn(
                    "absolute right-0 top-0 bottom-0 w-64 bg-zinc-950 border-l border-zinc-900 p-4 transition-transform duration-300 flex flex-col gap-6",
                    mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                )} onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-lg">Menu</span>
                        <button onClick={() => setMobileMenuOpen(false)}><X className="w-5 h-5 text-zinc-400" /></button>
                    </div>

                    <div>
                        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Settings</div>
                        <AutocompleteToggle />
                    </div>

                    <div>
                        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Languages</div>
                        <div className="flex flex-col gap-2">
                            {languages.map(lang => (
                                <Link
                                    key={lang.id}
                                    href={`/online-compiler/${lang.id}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between",
                                        pathname?.includes(`/online-compiler/${lang.id}`)
                                            ? "bg-purple-900/20 text-purple-400 border border-purple-900/50"
                                            : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                                    )}
                                >
                                    {lang.name}
                                    <ChevronRight className="w-3 h-3 opacity-50" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - Desktop (Resizable Panels) */}
            <div className="hidden md:flex flex-1 overflow-hidden">
                <PanelGroup direction="horizontal" className="flex-1">
                    <Panel defaultSize={50} minSize={30} className="flex flex-col">
                        <PanelGroup direction="vertical">
                            <Panel defaultSize={80} minSize={50} className="flex flex-col relative group">
                                <div className="px-4 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-900/50 border-b border-zinc-800">
                                    {language} Editor
                                </div>
                                <Editor
                                    height="100%"
                                    language={language === "c" || language === "cpp" ? "cpp" : language}
                                    value={code}
                                    theme="vs-dark"
                                    onChange={(value) => setCode(value || "")}
                                    onMount={handleEditorDidMount}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        lineNumbers: "on",
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        quickSuggestions: autocomplete,
                                        suggestOnTriggerCharacters: autocomplete,
                                        padding: { top: 16 },
                                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                    }}
                                />
                            </Panel>
                            <PanelResizeHandle className="h-2 bg-zinc-900 hover:bg-purple-500/50 transition-colors cursor-row-resize flex items-center justify-center group">
                                <div className="w-12 h-1 bg-zinc-700 rounded-full group-hover:bg-purple-400 transition-colors" />
                            </PanelResizeHandle>
                            <Panel defaultSize={20} minSize={10} className="flex flex-col border-t border-zinc-800">
                                <div className="px-4 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-900/50">
                                    Input
                                </div>
                                <textarea
                                    className="flex-1 w-full bg-zinc-900 text-zinc-100 p-4 resize-none focus:outline-none focus:ring-1 focus:ring-purple-500/50 font-mono text-sm"
                                    placeholder="Enter input here..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                            </Panel>
                        </PanelGroup>
                    </Panel>
                    <PanelResizeHandle className="w-2 bg-zinc-900 hover:bg-purple-500/50 transition-colors cursor-col-resize flex items-center justify-center group">
                        <div className="h-12 w-1 bg-zinc-700 rounded-full group-hover:bg-purple-400 transition-colors" />
                    </PanelResizeHandle>
                    <Panel defaultSize={50} minSize={30} className="flex flex-col">
                        <div className="flex justify-between items-center px-4 py-2 bg-zinc-900/50 border-b border-zinc-800">
                            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Output</div>
                            {error && <div className="text-xs font-bold text-red-500">Error</div>}
                        </div>
                        <div className="flex-1 p-4 overflow-auto font-mono text-sm whitespace-pre-wrap bg-zinc-950">
                            {error ? <span className="text-red-400">{error}</span> : <span className={output ? "text-zinc-100" : "text-zinc-500 italic"}>{output || "Output will appear here..."}</span>}
                        </div>
                    </Panel>
                </PanelGroup>
            </div>

            {/* Main Content - Mobile (Flex Column + Tabs) */}
            <div className="flex md:hidden flex-col h-[calc(100vh-56px)] overflow-hidden">
                {/* Editor Section */}
                <div className={cn(
                    "relative flex-col border-b border-zinc-800 transition-all duration-300",
                    fullScreenMode === 'editor' ? "fixed inset-0 z-40 h-full bg-zinc-950" : "flex h-[60%]",
                    fullScreenMode === 'io' ? "hidden" : "flex"
                )}>
                    <div className="px-4 py-2 flex justify-between items-center bg-zinc-900/50 border-b border-zinc-800 shrink-0">
                        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{language} editor</div>
                        <RunButton />
                        <button onClick={() => setFullScreenMode(fullScreenMode === 'editor' ? 'none' : 'editor')} className="p-1 text-zinc-400 hover:text-white">
                            {fullScreenMode === 'editor' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                        </button>
                    </div>
                    <Editor
                        height="100%"
                        language={language === "c" || language === "cpp" ? "cpp" : language}
                        value={code}
                        theme="vs-dark"
                        onChange={(value) => setCode(value || "")}
                        onMount={handleEditorDidMount}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 12, // Smaller font for mobile
                            lineNumbers: "on",
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            quickSuggestions: autocomplete,
                            suggestOnTriggerCharacters: autocomplete,
                            padding: { top: 8 },
                            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        }}
                    />
                </div>

                {/* Input/Output Tabs Section */}
                <div className={cn(
                    "flex-1 flex flex-col bg-zinc-900 relative transition-all duration-300",
                    fullScreenMode === 'io' ? "fixed inset-0 z-40 h-full bg-zinc-950" : "flex",
                    fullScreenMode === 'editor' ? "hidden" : "flex"
                )}>
                    <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 shrink-0">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('input')}
                                className={cn("px-4 py-3 text-sm font-medium border-b-2 transition-colors", activeTab === 'input' ? "border-purple-500 text-purple-400" : "border-transparent text-zinc-500")}
                            >
                                Input
                            </button>
                            <button
                                onClick={() => setActiveTab('output')}
                                className={cn("px-4 py-3 text-sm font-medium border-b-2 transition-colors relative", activeTab === 'output' ? "border-purple-500 text-purple-400" : "border-transparent text-zinc-500")}
                            >
                                Output
                                {loading && <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-purple-500/50 rounded-full animate-pulse" />}
                            </button>
                        </div>
                        <button onClick={() => setFullScreenMode(fullScreenMode === 'io' ? 'none' : 'io')} className="p-3 text-zinc-400 hover:text-white">
                            {fullScreenMode === 'io' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                        </button>
                    </div>

                    <div className="flex-1 relative overflow-hidden">
                        {/* Input Tab */}
                        <div className={cn("absolute inset-0 flex flex-col p-2", activeTab === 'input' ? "z-10 bg-zinc-900" : "z-0 opacity-0 pointer-events-none")}>
                            <textarea
                                className="flex-1 w-full bg-transparent text-zinc-100 p-2 resize-none focus:outline-none font-mono text-sm"
                                placeholder="Enter input here..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                        </div>

                        {/* Output Tab */}
                        <div className={cn("absolute inset-0 flex flex-col p-2 overflow-auto bg-zinc-950", activeTab === 'output' ? "z-10" : "z-0 opacity-0 pointer-events-none")}>
                            {error ? (
                                <span className="text-red-400 font-mono text-sm">{error}</span>
                            ) : (
                                <span className={cn("font-mono text-sm whitespace-pre-wrap", output ? "text-zinc-100" : "text-zinc-500 italic")}>
                                    {output || "Output will appear here..."}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompilerEditor;
