interface QuestionPage {
    _id: string
    title: string
    difficulty: string
    description: string
    tags: []
}

interface Problem {
    _id: number
    title: string
    difficulty: string
    slug: string
    solution: boolean
}

interface DefaultCode {
    [key: string]: { postcode: string, precode: string, template: string };
}

interface UserCode {
    [key: string]: string;
}

interface TestCase {
    input: string;
    expectedOutput: string;
    actualOutput?: string;
    passed?: boolean;
}

type SubmissionStatus = "accepted" | "runtime_error" | "wrong_answer"

interface SubmissionResultProps {
    status: SubmissionStatus
    passedTestCases?: number
    totalTestCases?: number
    code?: string
    message: string
    failedCase?: {
        input: string
        actualOutput: string
        expectedOutput: string
        memoryUsed: number
        passed: boolean
        testCaseNumber: number
        timeTaken: number
    }
}