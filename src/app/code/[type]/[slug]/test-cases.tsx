import { Button } from '@/components/ui/button';
import CircleLoading from '@/components/ui/circleLoading';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Lightbulb, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { TestCase } from '../../commonInterface';
import { structuredTestCases } from '@/utils/commonFunction';

interface TestCaseProps {
    testCases: TestCase[] | undefined;
    testCaseVariableNames: string;
    loading: boolean;
    error: string;
    aihelp: boolean
    aiHintFunction: () => void
    type: string
}

const TestCases: React.FC<TestCaseProps> = ({ testCases, testCaseVariableNames, loading, error, aihelp, aiHintFunction, type }) => {
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

    return (
        <ScrollArea className="h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="testcases" className='p-2'>
                <div className='flex justify-between'>
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
                    {aihelp && type !== "exam" && <Button onClick={aiHintFunction} variant='outline' className='rounded-full me-5'>Get Hint <Lightbulb color='#f59e0b'/></Button>}
                </div>
                <TabsContent value="testcases">
                    <Tabs value={activeTestCase} onValueChange={setActiveTestCase} className="h-full flex flex-col">
                        <div className="flex items-center mb-2">
                            <TabsList>
                                {testCases?.map((_, index) => (
                                    <TabsTrigger key={index + 1} value={`${index}`}>
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
                            const structuredInput = structuredTestCases(testCase.input, testCaseVariableNames);

                            return (
                                <TabsContent key={index + 1} value={`${index}`} className="flex-1">
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
                        loading ?
                            <CircleLoading />
                            :
                            error ?
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
                                        const structuredInput = structuredTestCases(testCase.input, testCaseVariableNames);

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