import React, { useCallback, useEffect, useRef } from 'react';
import MonacoEditor, { Monaco } from "@monaco-editor/react";
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
    const disposableRef = useRef<any>(null);

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
            // Note: 'language' prop is the short code (py, cpp), we need to check against that
            // or map it to what the register functions expect (usually the monaco language id)
            // My register functions register for "python", "cpp", "c", etc.

            // Map short code to standard language ID used by IntelliSense files
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
    }, [language, monacoRef.current]); // Re-run when language changes

    const handleEditorDidMount = (editor: any, monaco: Monaco) => {
        monacoRef.current = monaco;
    };


    const resetCode = () => {
        if (confirm("Do you want to reset your code?")) {
            const newCode = defaultCode ? defaultCode[language].template : ""
            setCode({
                ...code,
                [language]: newCode,
            })
            debouncedDispatch(newCode, language)
        }
    }

    const debouncedDispatch = useCallback(
        debounce((val: string, lang: string) => {
            dispatch(setUserCodeState({ type, questionNo, language: lang, code: val }))
        }, 300),
        [],
    )

    const changeLanguage = (lang: string) => {
        setLanguage(lang);
    };
    const onChangeCode = (val: string) => {
        setCode({
            ...code,
            [language]: val || ""
        })
        debouncedDispatch(val || "", language);
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