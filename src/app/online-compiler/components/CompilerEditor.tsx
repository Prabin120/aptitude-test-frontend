"use client"

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Editor, { Monaco } from "@monaco-editor/react";
import { editor, IDisposable } from "monaco-editor";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { executeCode, aiGenerateCode, aiImproveCode } from "../api";
import { Loader2, Play, Menu, Maximize2, Minimize2, X, ChevronRight, Sparkles, Wand2, User, LogOut, AlertTriangle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { registerPythonCompletion } from "../utils/pythonIntellisense";
import { registerCppCompletion } from "../utils/cppIntellisense";
import { registerCCompletion } from "../utils/cIntellisense";
import { registerJavaCompletion } from "../utils/javaIntellisense";
import { registerGoCompletion } from "../utils/goIntellisense";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import SettingsModal from "./SettingsModal";
import LogoFull from "@/components/logo";

interface CompilerEditorProps {
    language: string;
}

const languages = [
    { id: 'python', name: 'Python' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'cpp', name: 'C++' },
    { id: 'c', name: 'C' },
    { id: 'java', name: 'Java' },
    { id: 'go', name: 'Go' },
];

// localStorage key for persisting code during login redirect
const COMPILER_STORAGE_KEY = 'apticode_compiler_draft';

const CompilerEditor: React.FC<CompilerEditorProps> = ({ language }) => {
    const getDefaultCode = (lang: string): string => {
        switch (lang) {
            case 'python': return '# Tip: Select lines to use AI Generate/Improve features\n\nprint("AptiCode is best")';
            case 'javascript': return '// Tip: Select lines to use AI Generate/Improve features\n\nconsole.log("AptiCode is best");';
            case 'cpp': return '// Tip: Select lines to use AI Generate/Improve features\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "AptiCode is best" << endl;\n    return 0;\n}';
            case 'c': return '// Tip: Select lines to use AI Generate/Improve features\n\n#include <stdio.h>\n\nint main() {\n    printf("AptiCode is best\\n");\n    return 0;\n}';
            case 'java': return '// Tip: Select lines to use AI Generate/Improve features\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("AptiCode is best");\n    }\n}';
            case 'go': return '// Tip: Select lines to use AI Generate/Improve features\n\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("AptiCode is best")\n}';
            default: return '// Tip: Select lines to use AI Generate/Improve features\n// Write your code here';
        }
    };

    const [code, setCode] = useState<string>(getDefaultCode(language));
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [autocomplete, setAutocomplete] = useState<boolean>(true);
    const [isMounted, setIsMounted] = useState(false);

    // Selection-based AI State
    const [selectedText, setSelectedText] = useState<string>("");
    const [selectionRange, setSelectionRange] = useState<{ startLine: number; endLine: number } | null>(null);
    const [generating, setGenerating] = useState<'generate' | 'improve' | null>(null);

    // Popup states
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [showQuotaPopup, setShowQuotaPopup] = useState(false);
    const [showProfileSheet, setShowProfileSheet] = useState(false);

    // Mobile State
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');
    const [fullScreenMode, setFullScreenMode] = useState<'none' | 'editor' | 'io'>('none');

    const monacoRef = useRef<Monaco | null>(null);
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const disposableRef = useRef<IDisposable | null>(null);
    const pathname = usePathname();

    // Redux auth
    // const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector((state) => state.auth.authState);
    const userDetail = useAppSelector((state) => state.user);

    useEffect(() => {
        setIsMounted(true);

        // Restore code and input from localStorage if exists (after login redirect)
        const savedData = localStorage.getItem(COMPILER_STORAGE_KEY);
        if (savedData) {
            try {
                const { code: savedCode, input: savedInput, language: savedLanguage } = JSON.parse(savedData);
                if (savedLanguage === language && savedCode) {
                    setCode(savedCode);
                    if (savedInput) setInput(savedInput);
                }
            } catch (e) {
                console.error('Failed to parse saved code:', e);
            }
            // Clear after restoring - REMOVED to support persistent auto-save
            // localStorage.removeItem(COMPILER_STORAGE_KEY);
        }
    }, [language]);

    // Auto-save code to localStorage
    useEffect(() => {
        if (!isMounted) return;

        const timeoutId = setTimeout(() => {
            localStorage.setItem(COMPILER_STORAGE_KEY, JSON.stringify({
                code,
                input,
                language,
            }));
        }, 2000); // Auto-save after 2 seconds of inactivity

        return () => clearTimeout(timeoutId);
    }, [code, input, language, isMounted]);

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
    }, [language, autocomplete]);

    const getBackendLanguage = (lang: string) => {
        if (lang === "python") return "py";
        if (lang === "javascript") return "js";
        return lang;
    };

    const handleDownload = () => {
        const extensionMap: { [key: string]: string } = {
            python: 'py',
            javascript: 'js',
            cpp: 'cpp',
            c: 'c',
            java: 'java',
            go: 'go'
        };
        const ext = extensionMap[language] || 'txt';
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Main.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleEditorDidMount = (editorInstance: editor.IStandaloneCodeEditor, monaco: Monaco) => {
        monacoRef.current = monaco;
        editorRef.current = editorInstance;

        // Register custom actions and keybindings
        editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR, () => {
            handleRun();
        });

        editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            handleDownload();
        });

        editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyF, () => {
            import("sonner").then(({ toast }) => {
                toast.info("Formatting is not supported for this language in the online editor yet.");
            });
        });


        editorInstance.onDidChangeCursorSelection((e) => {
            const selection = e.selection;
            const model = editorInstance.getModel();
            if (model && !selection.isEmpty()) {
                const text = model.getValueInRange(selection);
                setSelectedText(text);
                setSelectionRange({
                    startLine: selection.startLineNumber,
                    endLine: selection.endLineNumber
                });
            } else {
                setSelectedText("");
                setSelectionRange(null);
            }
        });
    };

    const handleRun = async () => {
        setLoading(true);
        setOutput("");
        setError("");
        setActiveTab('output');

        try {
            const result = await executeCode(code, getBackendLanguage(language), input);
            if (typeof result === "string") {
                setError(result);
            } else {
                setOutput(result.ActualOutput);
            }
        } catch {
            setError("An error occurred while executing the code.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditorChange = (value: string | undefined) => {
        setCode(value || "");
    };

    // Check if response indicates auth error (401/403)
    const isAuthError = (response: unknown): boolean => {
        if (typeof response === 'object' && response !== null) {
            const resp = response as { status?: number };
            return resp.status === 401 || resp.status === 403;
        }
        if (typeof response === 'string') {
            return response.toLowerCase().includes('unauthorized');
        }
        return false;
    };

    // Check if response indicates quota exceeded (405)
    const isQuotaError = (response: unknown): boolean => {
        if (typeof response === 'object' && response !== null) {
            const resp = response as { status?: number };
            return resp.status === 405;
        }
        if (typeof response === 'string') {
            return response.toLowerCase().includes('no calls left');
        }
        return false;
    };

    // AI: Generate code from selected text
    const handleGenerateCode = async () => {
        if (!selectedText || !selectionRange) return;
        setGenerating('generate');

        try {
            const res = await aiGenerateCode(language, selectedText);

            // Check for auth error
            if (isAuthError(res)) {
                setShowLoginPopup(true);
                return;
            }

            // Check for quota exceeded
            if (isQuotaError(res)) {
                setShowQuotaPopup(true);
                return;
            }
            const resJson = await res.json()
            const response = resJson.response;
            if (response && typeof response === 'string' && !response.includes('not available')) {
                const editorInstance = editorRef.current;
                const monaco = monacoRef.current;
                if (monaco && editorInstance) {
                    const model = editorInstance.getModel();
                    if (model) {
                        const insertLine = selectionRange.endLine + 1;
                        const range = new monaco.Range(insertLine, 1, insertLine, 1);
                        editorInstance.executeEdits("ai-generate", [{
                            range: range,
                            text: "\n" + response + "\n",
                            forceMoveMarkers: true
                        }]);
                    }
                }
            } else {
                setError("Could not generate code. Please try again.");
            }
        } catch (e) {
            console.error(e);
            setError("AI Generation failed");
        } finally {
            setGenerating(null);
        }
    };

    // AI: Improve selected code - comments out original and adds improved below
    const handleImproveCode = async () => {
        if (!selectedText || !selectionRange) return;
        setGenerating('improve');

        try {
            const res = await aiImproveCode(language, selectedText);
            if (isAuthError(res)) {
                console.log("Auth error");
                setShowLoginPopup(true);
                return;
            }

            // Check for quota exceeded
            if (isQuotaError(res)) {
                setShowQuotaPopup(true);
                return;
            }
            const resJson = await res.json()
            const response = resJson.response;

            if (response && typeof response === 'string' && !response.includes('not available')) {
                const editorInstance = editorRef.current;
                const monaco = monacoRef.current;
                if (monaco && editorInstance) {
                    const model = editorInstance.getModel();
                    if (model) {
                        // Get language-specific single-line comment syntax
                        // Using single-line comments to avoid issues with existing multiline comments
                        const getCommentPrefix = (lang: string): string => {
                            switch (lang) {
                                case 'python':
                                    return '# ';
                                case 'javascript':
                                case 'java':
                                case 'cpp':
                                case 'c':
                                case 'go':
                                default:
                                    return '// ';
                            }
                        };

                        const commentPrefix = getCommentPrefix(language);

                        // Comment out each line of the selected code individually
                        const lines = selectedText.split('\n');
                        const commentedLines = lines.map(line => commentPrefix + line);
                        const commentedCode = `${commentPrefix}--- Original code (improved below) ---\n${commentedLines.join('\n')}\n${commentPrefix}--- End of original code ---`;
                        const newContent = commentedCode + "\n\n" + response;

                        // Replace the selection with commented code + improved code
                        const startLine = selectionRange.startLine;
                        const endLine = selectionRange.endLine;
                        const endColumn = model.getLineMaxColumn(endLine);

                        const range = new monaco.Range(startLine, 1, endLine, endColumn);
                        editorInstance.executeEdits("ai-improve", [{
                            range: range,
                            text: newContent,
                            forceMoveMarkers: true
                        }]);
                    }
                }
            } else {
                setError("Could not improve code. Please try again.");
            }
        } catch (e) {
            console.error(e);
            setError("AI Improvement failed");
        } finally {
            setGenerating(null);
        }
    };

    const RunButton = () => (
        <button
            onClick={handleRun}
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-primary-text px-4 md:px-6 py-1.5 rounded-sm flex items-center gap-2 font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg shadow-primary/20 text-sm md:text-base whitespace-nowrap"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            <span className="hidden md:inline">Run Code</span>
            <span className="md:hidden">Run</span>
        </button>
    );

    const AutocompleteToggle = () => (
        <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-400 hover:text-zinc-200 transition-colors">
            <input
                type="checkbox"
                checked={autocomplete}
                onChange={(e) => setAutocomplete(e.target.checked)}
                className="w-4 h-4 accent-primary rounded"
            />
            <span className="text-sm">Autocomplete</span>
        </label>
    );

    const AiActionButtons = () => {
        if (!selectedText) return null;
        return (
            <div className="flex items-center gap-2">
                <button
                    onClick={handleGenerateCode}
                    disabled={generating !== null}
                    className="bg-gradient-to-r from-primary to-pink-600 hover:from-primary/80 hover:to-pink-500 text-white px-3 py-1.5 rounded-sm flex items-center gap-1.5 text-xs font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg"
                >
                    {generating === 'generate' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    <span>Generate</span>
                </button>
                <button
                    onClick={handleImproveCode}
                    disabled={generating !== null}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-3 py-1.5 rounded-sm flex items-center gap-1.5 text-xs font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg"
                >
                    {generating === 'improve' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                    <span>Improve</span>
                </button>
            </div>
        );
    };

    // Profile or Login button - like normal header
    const ProfileOrLogin = () => {
        if (isAuthenticated) {
            return (
                <button
                    onClick={() => setShowProfileSheet(true)}
                    className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-text text-sm font-medium hover:bg-primary/90 transition-colors overflow-hidden"
                >
                    {userDetail.image ? (
                        <img src={userDetail.image} alt={userDetail.name} className="w-full h-full object-cover" />
                    ) : (
                        userDetail.name ? userDetail.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />
                    )}
                </button>
            );
        }
        return (
            <Link href="/login">
                <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-1.5 rounded-sm text-sm font-medium transition-colors">
                    Login
                </button>
            </Link>
        );
    };

    // Save code to localStorage before redirecting to login
    const saveCodeBeforeLogin = () => {
        localStorage.setItem(COMPILER_STORAGE_KEY, JSON.stringify({
            code,
            input,
            language,
        }));
    };

    // Login Popup Modal using shadcn Dialog
    const LoginPopup = () => (
        <Dialog open={showLoginPopup} onOpenChange={setShowLoginPopup}>
            <DialogContent className="bg-zinc-900 border-zinc-800 max-w-sm">
                <DialogHeader className="text-center sm:text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-primary" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-white">Login Required</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Please login to use AI features like Generate and Improve code.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-3 sm:justify-center">
                    <button
                        onClick={() => setShowLoginPopup(false)}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <Link href="/login" className="flex-1" onClick={saveCodeBeforeLogin}>
                        <button className="w-full px-4 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-text font-medium transition-colors">
                            Login
                        </button>
                    </Link>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    // Quota Exceeded Popup Modal using shadcn Dialog
    const QuotaExceededPopup = () => (
        <Dialog open={showQuotaPopup} onOpenChange={setShowQuotaPopup}>
            <DialogContent className="bg-zinc-900 border-zinc-800 max-w-sm">
                <DialogHeader className="text-center sm:text-center">
                    <div className="w-16 h-16 bg-amber-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-amber-400" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-white">Daily Quota Exceeded</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        You have used all your AI calls for today. Your quota will reset tomorrow. If you want to use more AI calls, click on Read More.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-3 sm:justify-center">
                    <button
                        onClick={() => setShowQuotaPopup(false)}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors"
                    >
                        Close
                    </button>
                    <button className="flex-1 px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium transition-colors">
                        Read More
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    // Profile Sheet using shadcn Sheet
    const ProfileSheetComponent = () => (
        <Sheet open={showProfileSheet} onOpenChange={setShowProfileSheet}>
            <SheetContent className="bg-zinc-950 border-l-zinc-800">
                <SheetHeader>
                    <SheetTitle className="text-white">Profile</SheetTitle>
                </SheetHeader>
                <div className="flex items-center gap-3 mt-6 mb-6">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-text text-xl font-medium overflow-hidden">
                        {userDetail.image ? (
                            <img src={userDetail.image} alt={userDetail.name} className="w-full h-full object-cover" />
                        ) : (
                            userDetail.name ? userDetail.name.charAt(0).toUpperCase() : '?'
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-white text-lg">{userDetail.name || 'User'}</p>
                        <p className="text-sm text-zinc-400">{userDetail.email || ''}</p>
                    </div>
                </div>
                <div className="space-y-1">
                    <Link href={`/profile/${userDetail.username}/code`} onClick={() => setShowProfileSheet(false)}>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-300 hover:bg-zinc-800 transition-colors text-left">
                            <User className="w-4 h-4" />
                            <span>View Profile</span>
                        </button>
                    </Link>
                    <Link href="/logout">
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-300 hover:bg-zinc-800 transition-colors text-left">
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </Link>
                </div>
            </SheetContent>
        </Sheet>
    );

    const editorOptions = useMemo<editor.IStandaloneEditorConstructionOptions>(() => ({
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        quickSuggestions: autocomplete,
        suggestOnTriggerCharacters: autocomplete,
        padding: { top: 16 },
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    }), [autocomplete]);

    if (!isMounted) {
        return <div className="h-full w-full bg-zinc-950 flex items-center justify-center text-zinc-500">Loading editor...</div>;
    }

    return (
        <div className="h-full w-full flex flex-col bg-zinc-950 relative overflow-hidden">
            {/* Popups using shadcn components */}
            <LoginPopup />
            <QuotaExceededPopup />
            <ProfileSheetComponent />

            {/* Desktop Header */}
            <div className="hidden md:flex justify-between items-center px-4 py-2 border-b border-zinc-800 bg-zinc-950 shrink-0 h-14">
                <Link className="flex items-center justify-center" href="/">
                    <LogoFull />
                </Link>
                <div className="flex items-center gap-3 relative group">
                    <RunButton />
                    {/* Tooltip */}
                    <span className="absolute left-9 top-14 -translate-y-1/2 bg-zinc-900 text-white text-xs p-2  rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-zinc-800">
                        CTRL + R
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <AutocompleteToggle />
                    {/* Settings Button will go here */}
                    {/* <SettingsModal>
                        <button className="text-zinc-400 hover:text-zinc-100 transition-colors p-1">
                            <Settings className="w-5 h-5" />
                        </button>
                    </SettingsModal> */}
                    <ProfileOrLogin />
                </div>
            </div>

            {/* Mobile Header */}
            <div className="flex md:hidden justify-between items-center px-4 py-2 border-b border-zinc-800 bg-zinc-950 shrink-0 h-14 z-20">
                <Link className="flex items-center justify-center" href="/">
                    <LogoFull />
                </Link>
                <div className="flex items-center gap-2">
                    <AiActionButtons />
                    <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-zinc-400 hover:text-white">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={cn(
                "fixed inset-0 bg-black/80 z-50 backdrop-blur-sm transition-opacity md:hidden",
                mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )} onClick={() => setMobileMenuOpen(false)}>
                <div className={cn(
                    "absolute right-0 top-0 bottom-0 w-64 bg-zinc-950 border-l border-zinc-900 p-4 transition-transform duration-300 flex flex-col gap-6",
                    mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                )} onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-lg">
                            <ProfileOrLogin />
                        </span>
                        <button onClick={() => setMobileMenuOpen(false)}><X className="w-5 h-5 text-zinc-400" /></button>
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Settings</div>
                        <div className="flex flex-col gap-4">
                            <AutocompleteToggle />
                            <SettingsModal>
                                <button className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200" onClick={() => { }}>
                                    <Settings className="w-4 h-4" />
                                    <span className="text-sm">More Settings</span>
                                </button>
                            </SettingsModal>
                        </div>
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
                                            ? "bg-primary/20 text-primary border border-primary/50"
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

            {/* Desktop Content */}
            <div className="hidden md:flex flex-1 overflow-hidden">
                <PanelGroup direction="horizontal" className="flex-1">
                    <Panel defaultSize={50} minSize={30} className="flex flex-col">
                        <PanelGroup direction="vertical">
                            <Panel defaultSize={80} minSize={70} className="flex flex-col">
                                <div className="px-4 min-h-[40px] py-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-900/50 border-b border-zinc-800 flex justify-between items-center">
                                    <span>{language} Editor</span>
                                    {selectedText && (
                                        <span className="text-primary text-[10px] font-normal flex items-center gap-4 normal-case">
                                            <AiActionButtons />
                                            {selectionRange?.startLine === selectionRange?.endLine
                                                ? `Line ${selectionRange?.startLine} selected`
                                                : `Lines ${selectionRange?.startLine}-${selectionRange?.endLine} selected`}
                                        </span>
                                    )}
                                </div>
                                <Editor
                                    height="100%"
                                    language={language === "c" || language === "cpp" ? "cpp" : language}
                                    value={code}
                                    theme="vs-dark"
                                    onChange={handleEditorChange}
                                    onMount={handleEditorDidMount}
                                    options={editorOptions}
                                />
                            </Panel>
                            <PanelResizeHandle className="h-2 bg-zinc-900 hover:bg-primary/50 transition-colors cursor-row-resize flex items-center justify-center">
                                <div className="w-12 h-1 bg-zinc-700 rounded-full" />
                            </PanelResizeHandle>
                            <Panel defaultSize={20} minSize={10} className="flex flex-col border-t border-zinc-800">
                                <div className="px-4 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-900/50">Input</div>
                                <textarea
                                    className="flex-1 w-full bg-zinc-900 text-zinc-100 p-4 resize-none focus:outline-none font-mono text-sm"
                                    placeholder="Enter input here..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                            </Panel>
                        </PanelGroup>
                    </Panel>
                    <PanelResizeHandle className="w-2 bg-zinc-900 hover:bg-primary/50 transition-colors cursor-col-resize flex items-center justify-center">
                        <div className="h-12 w-1 bg-zinc-700 rounded-full" />
                    </PanelResizeHandle>
                    <Panel defaultSize={50} minSize={30} className="flex flex-col">
                        <div className="flex justify-between items-center px-4 py-2 bg-zinc-900/50 border-b border-zinc-800">
                            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider min-h-[20px]">Output</div>
                            {error && <div className="text-xs font-bold text-red-500">Error</div>}
                        </div>
                        <div className="flex-1 p-4 overflow-auto font-mono text-sm whitespace-pre-wrap bg-zinc-950">
                            {error ? <span className="text-red-400">{error}</span> : <span className={output ? "text-zinc-100" : "text-zinc-500 italic"}>{output || "Output will appear here..."}</span>}
                        </div>
                    </Panel>
                </PanelGroup>
            </div>

            {/* Mobile Content */}
            <div className="flex md:hidden flex-col h-[calc(100vh-56px)] overflow-hidden">
                <div className={cn(
                    "relative flex-col border-b border-zinc-800 transition-all duration-300",
                    fullScreenMode === 'editor' ? "fixed inset-0 z-40 h-full bg-zinc-950" : "flex h-[60%]",
                    fullScreenMode === 'io' ? "hidden" : "flex"
                )}>
                    <div className="px-4 py-2 flex justify-between items-center bg-zinc-900/50 border-b border-zinc-800 shrink-0">
                        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{language} editor</div>
                        <div className="flex items-center gap-2">
                            <RunButton />
                            <button onClick={() => setFullScreenMode(fullScreenMode === 'editor' ? 'none' : 'editor')} className="p-1 text-zinc-400 hover:text-white">
                                {fullScreenMode === 'editor' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <Editor
                        height="100%"
                        language={language === "c" || language === "cpp" ? "cpp" : language}
                        value={code}
                        theme="vs-dark"
                        onChange={handleEditorChange}
                        onMount={handleEditorDidMount}
                        options={{ ...editorOptions, fontSize: 12, padding: { top: 8 } }}
                    />
                </div>

                <div className={cn(
                    "flex-1 flex flex-col bg-zinc-900 relative transition-all duration-300",
                    fullScreenMode === 'io' ? "fixed inset-0 z-40 h-full bg-zinc-950" : "flex",
                    fullScreenMode === 'editor' ? "hidden" : "flex"
                )}>
                    <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 shrink-0">
                        <div className="flex">
                            <button onClick={() => setActiveTab('input')} className={cn("px-4 py-3 text-sm font-medium border-b-2 transition-colors", activeTab === 'input' ? "border-primary text-primary" : "border-transparent text-zinc-500")}>Input</button>
                            <button onClick={() => setActiveTab('output')} className={cn("px-4 py-3 text-sm font-medium border-b-2 transition-colors relative", activeTab === 'output' ? "border-primary text-primary" : "border-transparent text-zinc-500")}>
                                Output
                                {loading && <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary/50 rounded-full animate-pulse" />}
                            </button>
                        </div>
                        <button onClick={() => setFullScreenMode(fullScreenMode === 'io' ? 'none' : 'io')} className="p-3 text-zinc-400 hover:text-white">
                            {fullScreenMode === 'io' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                        </button>
                    </div>
                    <div className="flex-1 relative overflow-hidden">
                        <div className={cn("absolute inset-0 flex flex-col p-2", activeTab === 'input' ? "z-10 bg-zinc-900" : "z-0 opacity-0 pointer-events-none")}>
                            <textarea className="flex-1 w-full bg-transparent text-zinc-100 p-2 resize-none focus:outline-none font-mono text-sm" placeholder="Enter input here..." value={input} onChange={(e) => setInput(e.target.value)} />
                        </div>
                        <div className={cn("absolute inset-0 flex flex-col p-2 overflow-auto bg-zinc-950", activeTab === 'output' ? "z-10" : "z-0 opacity-0 pointer-events-none")}>
                            {error ? <span className="text-red-400 font-mono text-sm">{error}</span> : <span className={cn("font-mono text-sm whitespace-pre-wrap", output ? "text-zinc-100" : "text-zinc-500 italic")}>{output || "Output will appear here..."}</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompilerEditor;
