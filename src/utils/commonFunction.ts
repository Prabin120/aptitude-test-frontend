export interface ErrorResponse {
  message: string;
  status: number;
}

export const calculateTimeLeft = (time: string) => {
    const now = new Date();
    const testTime = new Date(time);
    const timeLeft = testTime.getTime() - now.getTime();
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    const timeLeftString = `${days ? days + "d" : ""} ${hours ? hours + "h" : ""
        } ${minutes ? minutes + "m" : ""} ${seconds}s`;
    return {timeLeft, timeLeftString};
};


const parseVariableNames = (variableData: string) => {
    const variables = variableData?.trim().split('\n').map((line) => {
        const [name, structure, type] = line.trim().split(' ');
        return { name, structure, type };
    });
    return variables;
};

interface StructuredInput {
    [key: string]: number | string | string[] | number[];
}

export const structuredTestCases = (testCase: string, testCaseVariableNames: string) => {
    if (!testCase || !testCaseVariableNames) {
        return {};
    }
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
