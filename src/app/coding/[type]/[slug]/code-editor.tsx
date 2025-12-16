import React, { useEffect, useRef, useMemo } from 'react';
import MonacoEditor, { Monaco } from "@monaco-editor/react";
import { editor, IDisposable } from "monaco-editor";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Expand, RotateCcw } from 'lucide-react';
import { DefaultCode, UserCode } from '../../commonInterface';
import { useDispatch } from 'react-redux';
import { setUserCodeState } from '@/redux/userCode/userCode';
import { debounce } from "lodash";

// IntelliSense Imports
import { registerPythonCompletion } from "../../../online-compiler/utils/pythonIntellisense";
import { registerCppCompletion } from "../../../online-compiler/utils/cppIntellisense";
import { registerCCompletion } from "../../../online-compiler/utils/cIntellisense";
import { registerJavaCompletion } from "../../../online-compiler/utils/javaIntellisense";
import { registerGoCompletion } from "../../../online-compiler/utils/goIntellisense";

const languageHighlighter = (val: string) => {
    return {
        "py": "python",
        "js": "javascript",
        "java": "java",
        "cpp": "cpp",
        "c": "c",
        "go": "go",
    }[val];
};

interface CodeEditorProps {
    code: UserCode;
    setCode: (val: UserCode) => void;
    language: string;
    setLanguage: (val: string) => void;
    defaultCode: DefaultCode | undefined;
    questionNo: string
    type: string
}

const CodeEditor = ({ code, setCode, language, setLanguage, defaultCode, questionNo, type }: CodeEditorProps) => {
    const dispatch = useDispatch();
    const monacoRef = useRef<Monaco | null>(null);
    const disposableRef = useRef<IDisposable | null>(null);

    // --- IntelliSense Effect ---
    useEffect(() => {
        if (!monacoRef.current) return;
        const monaco = monacoRef.current;

        // Clean up previous provider
        if (disposableRef.current) {
            disposableRef.current.dispose();
            disposableRef.current = null;
        }

        try {
            // Register provider based on ACTIVE language
            const langId = languageHighlighter(language);

            switch (langId) {
                case 'python': disposableRef.current = registerPythonCompletion(monaco); break;
                case 'cpp': disposableRef.current = registerCppCompletion(monaco); break;
                case 'c': disposableRef.current = registerCCompletion(monaco); break;
                case 'java': disposableRef.current = registerJavaCompletion(monaco); break;
                case 'go': disposableRef.current = registerGoCompletion(monaco); break;
            }
        } catch (err) {
            console.error('Failed to register completion provider:', err);
        }

        return () => {
            if (disposableRef.current) disposableRef.current.dispose();
        };
    }, [language]); // Removed monacoRef.current dependency

    const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
        monacoRef.current = monaco;
        // Trigger IntelliSense registration manually on mount if needed, or let useEffect handle it
        // Since we set monacoRef.current, the useEffect won't re-run automatically unless 'language' changes or we force it.
        // We should force a re-run or register directly here.
        // Easiest is to force re-render, but better is to extract logic.
        // For now, let's just copy the registration logic or extract it.
        // Actually, just setLanguage to itself? No.
        // The useEffect depends on [language].
        // If we just mounted, monacoRef was null, now it's set. The Effect did NOT run with monaco set.
        // We need to kick start it.
        // Let's call a minimal version of the effect logic here.

        try {
            const langId = languageHighlighter(language);
            switch (langId) {
                case 'python': disposableRef.current = registerPythonCompletion(monaco); break;
                case 'cpp': disposableRef.current = registerCppCompletion(monaco); break;
                case 'c': disposableRef.current = registerCCompletion(monaco); break;
                case 'java': disposableRef.current = registerJavaCompletion(monaco); break;
                case 'go': disposableRef.current = registerGoCompletion(monaco); break;
            }
        } catch (e) { console.error(e); }
    };


    const resetCode = () => {
        if (confirm("Do you want to reset your code?")) {
            const newCode = defaultCode ? defaultCode[language].template : ""
            setCode({
                ...code,
                [language]: newCode,
            })
            debouncedUpdate(type, questionNo, language, newCode)
        }
    }

    // Memoized debounce function that takes all changing params as arguments
    const debouncedUpdate = useMemo(
        () => debounce((t: string, q: string, l: string, c: string) => {
            dispatch(setUserCodeState({ type: t, questionNo: q, language: l, code: c }))
        }, 300),
        [dispatch]
    );

    const changeLanguage = (lang: string) => {
        setLanguage(lang);
    };
    const onChangeCode = (val: string) => {
        setCode({
            ...code,
            [language]: val || ""
        })
        debouncedUpdate(type, questionNo, language, val || "");
    }
    return (
        <div className='h-full'>
            <div className='flex flex-row justify-between px-3'>
                <div>
                    <Select onValueChange={changeLanguage} defaultValue={language}>
                        <SelectTrigger className='h-7'>
                            <SelectValue placeholder={language} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cpp">C++</SelectItem>
                            <SelectItem value="py">Python</SelectItem>
                            {/* <SelectItem value="js">JavaScript</SelectItem> */}
                            <SelectItem value="java">Java</SelectItem>
                            <SelectItem value="c">C</SelectItem>
                            <SelectItem value="go">Go</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex flex-row items-center gap-3'>
                    <button onClick={resetCode}>
                        <RotateCcw size={16} className='text-neutral-300' />
                    </button>
                    <Expand size={16} className='text-neutral-300' />
                </div>
            </div>
            <MonacoEditor
                height={"95%"}
                defaultLanguage={languageHighlighter(language)}
                language={languageHighlighter(language)}
                theme='vs-dark'
                value={code[language]}
                onChange={(value) => onChangeCode(value ?? "")}
                onMount={handleEditorDidMount}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    quickSuggestions: true,
                    suggestOnTriggerCharacters: true,
                }}
            />
        </div>
    );
};

export default CodeEditor;