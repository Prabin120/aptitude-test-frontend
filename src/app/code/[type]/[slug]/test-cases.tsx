import { Button } from '@/components/ui/button';
import CircleLoading from '@/components/ui/circleLoading';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { TestCase } from '../../commonInterface';

interface TestCaseProps {
    testCases: TestCase[] | undefined;
    testCaseVariableNames: string;
    loading: boolean;
    error: string;
}

const TestCases: React.FC<TestCaseProps> = ({ testCases, testCaseVariableNames, loading, error }) => {
    const [activeTestCase, setActiveTestCase] = useState("0")
    // const [newTestcase, setNewTestcase] = useState<boolean>(false)
    const [activeTab, setActiveTab] = useState("testcases");
    // Trigger the "Test Results" tab when loading is true
    const newTestcase = false;
    useEffect(() => {
        if (loading) {
            setActiveTab("results");
        }
    }, [loading]);
    const addTestCase = () => {
        // setNewTestcase(true)
        // const newId = (testCases.length + 1).toString()
        // const newTestcase = testCases.find((testCase) => testCase.id === activeTestCase)
        // if(newTestcase){
        //     const {id, ...testCase} = newTestcase
        //     setTestCases([...testCases, { ...testCase, id: newId }])
        //     setActiveTestCase(newId)
        // }
    }
    interface StructuredInput {
        [key: string]: number | string | string[] | number[];
    }
    const parseVariableNames = (variableData: string) => {
        const variables = variableData.trim().split('\n').map((line) => {
            const [name, structure, type] = line.trim().split(' ');
            return { name, structure, type };
        });
        return variables;
    };
    const structuredTestCases = (testCase: string) => {
        const variableInfo = parseVariableNames(testCaseVariableNames);
        const inputLines = testCase.split('\n'); // Split input by newline
        const numberOfLines = parseInt(inputLines[0]); // First line indicates number of variables
        const structuredInput: StructuredInput = {};
        for (let i = 1; i <= numberOfLines; i++) {
            const { name, structure, type } = variableInfo[i - 1];
            let data;
            if (structure === 'array') {
                if (type === 'number') {
                    data = inputLines[i*2].split(' ').map(Number);
                } else {
                    data = inputLines[i*2].split(' ');
                }
            } else if (structure === 'number') {
                data = parseInt(inputLines[i*2]);
            } else {
                data = inputLines[i*2];
            }
            structuredInput[name] = data;
        }
        return structuredInput;
    };

    return (
        <ScrollArea className="h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="testcases" className='p-2'>
                <TabsList>
                    <TabsTrigger value="testcases">Test Cases</TabsTrigger>
                    <TabsTrigger value="results">{loading ?
                        <span className='pr-2'>
                            <CircleLoading color='bg-neutral-500' />
                        </span>
                        : ""
                    }  Test Results
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="testcases">
                    <Tabs value={activeTestCase} onValueChange={setActiveTestCase} className="h-full flex flex-col">
                        <div className="flex items-center mb-2">
                            <TabsList>
                                {testCases?.map((_, index) => (
                                    <TabsTrigger key={index} value={`${index}`}>
                                        Case {index + 1}
                                    </TabsTrigger>
                                ))}
                                <Button size="sm" variant={null} onClick={() => addTestCase()}>
                                    <Plus className="h-4 w-4 mr-2 hover:text-neutral-300" />
                                </Button>
                            </TabsList>
                        </div>

                        {testCases?.map((testCase, index) => {
                            // Process the structured input here for each test case
                            const structuredInput = structuredTestCases(testCase.input);

                            return (
                                <TabsContent key={index} value={`${index}`} className="flex-1">
                                    <ScrollArea className="h-full">
                                        <div className="p-2 bg-muted rounded-md">
                                            {Object.keys(structuredInput).map((key) => (
                                                <div key={key}>
                                                    <p>{key} = </p>
                                                    <Input
                                                        className="w-fit"
                                                        value={JSON.stringify(structuredInput[key])}
                                                        readOnly={!newTestcase}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </TabsContent>
                            );
                        })}
                    </Tabs>
                </TabsContent>

                <TabsContent value="results">
                    {
                        loading?
                        <CircleLoading/>
                        :
                            error?
                            <div className="h-full flex items-center bg-neutral-700 m-3 p-2 rounded-lg text-red-400 justify-center">
                                <p>{error}</p>
                            </div>
                            :
                            <Tabs value={activeTestCase} onValueChange={setActiveTestCase} className="h-full flex flex-col">
                                <div className="flex items-center mb-2">
                                    <TabsList>
                                        {testCases?.map((testCase, index) => (
                                            <TabsTrigger key={index} value={`${index}`}>
                                                <small className={`p-1 mr-1 rounded-full ${testCase.passed ? "bg-green-600" : "bg-red-600"}`}></small>Case {index + 1}
                                            </TabsTrigger>
                                        ))}
                                        <Button size="sm" variant={null} onClick={() => addTestCase()}>
                                            <Plus className="h-4 w-4 mr-2 hover:text-neutral-300" />
                                        </Button>
                                    </TabsList>
                                </div>

                                {testCases?.map((testCase, index) => {
                                    // Process the structured input here for each test case
                                    const structuredInput = structuredTestCases(testCase.input);

                                    return (
                                        <TabsContent key={index} value={`${index}`} className="flex-1">
                                            <ScrollArea className="h-full">
                                                <div className="p-2 bg-muted rounded-md">
                                                    <p>Input:</p>
                                                    {Object.keys(structuredInput).map((key) => (
                                                        <div key={key} className='bg-neutral-950 p-2 m-2 rounded'>
                                                            <p>{key} = </p>
                                                            <p>{JSON.stringify(structuredInput[key])}</p>
                                                        </div>
                                                    ))}
                                                    <p>Output:</p>
                                                    <p className='bg-neutral-950 p-2 m-2 rounded'>{testCase.actualOutput}</p>
                                                    <p>Expected:</p>
                                                    <p className='bg-neutral-950 p-2 m-2 rounded'>{testCase.expectedOutput}</p>
                                                </div>
                                            </ScrollArea>
                                        </TabsContent>
                                    );
                                })}
                            </Tabs>
                    }
                </TabsContent>
            </Tabs>
        </ScrollArea>
    )
}

export default TestCases