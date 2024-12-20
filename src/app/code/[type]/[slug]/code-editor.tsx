import React from 'react';
import MonacoEditor from "@monaco-editor/react";
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
}

const CodeEditor = ({ code, setCode, language, setLanguage, defaultCode, questionNo }: CodeEditorProps) => {
    const dispatch = useDispatch();
    const resetCode = () => {
        if (confirm("Do you want to reset your code?")) {
            setCode({
                ...code,
                [language]: defaultCode ? defaultCode[language].template : ""
            });
        }
    };

    const changeLanguage = (lang: string) => {
        setLanguage(lang);
    };
    const onChangeCode = (val: string) => {
        setCode({
            ...code,
            [language]: val || ""
        })
        dispatch(setUserCodeState({ questionNo, code: val || "", language }));        
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
                            <SelectItem value="js">JavaScript</SelectItem>
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
                onChange={(value)=>onChangeCode(value ?? "")}
            />
        </div>
    );
};

export default CodeEditor;