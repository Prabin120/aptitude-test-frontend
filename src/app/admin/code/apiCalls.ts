import { codeCompileApiEntryPoint, codeQuestion, getOwnedQuestion, getQuestionCompanies, getQuestionTags, verifyUserUploadedCode } from "@/consts"
import { TagItem } from "./_components/combobox-with-tags"
import { handleGetMethod, handlePostMethod, handlePutMethod } from "@/app/code/apiCalls";

export const getOwnedQuestionBySlug = async (slug: string) => {
    const response = await handleGetMethod(getOwnedQuestion + `?slug=${slug}`);
    if (response instanceof Response) {
        const res = await response.json();
        if (response.status === 200 || response.status === 201) {
            return res.data;
        } else {
            return res.message;
        }
    }
    return "Server error, please try again later.";
};

export const updateQuestion = async (slug: string, data: object) => {
    const response = await handlePutMethod(`${codeQuestion}?slug=${slug}`, data);
    if (response instanceof Response) {
        if (response.status === 200 || response.status === 201) {
            return "Question added successfully";
        } else {
            const res = await response.json();
            return res.message;
        }
    }
    // return "Question added successfully";
    return "Server error, please try again later.";
};

// export const addTestCases = async (data: object) => {
//     const response = await handlePostMethod(testCases, data);
//     return response;
// };
// export const modifyTestCase = async (id: string, data: object) => {
//     const response = await handlePutMethod(`${testCases}?id=${id}`, data);
//     if (response instanceof Response) {
//         if (response.status === 200 || response.status === 201) {
//             return "Test cases added successfully";
//         } else {
//             const res = await response.json();
//             return res.message;
//         }
//     }
//     return "Server error, please try again later.";
// };

export const verifyCode = async (code: string, language: string, testCases: {input: string, output: string}[]) => {
    const response = await handlePostMethod(verifyUserUploadedCode, {code, language, testCases});
    if (response instanceof Response) {
        return response.json();
    }
    return undefined;
};

export const addQuestion = async (data: object) => {
    const response = await handlePostMethod(codeQuestion, data);
    if (response instanceof Response) {
        if (response.status === 200 || response.status === 201) {
            return "Question added successfully";
        } else {
            const res = await response.json();
            return res.message;
        }
    }
    return "Server error, please try again later.";
};

export async function getAllCompanies(): Promise<TagItem[]> {
    try {
        const response = await fetch(codeCompileApiEntryPoint + getQuestionCompanies)
        if (!response.ok) throw new Error("Failed to fetch companies")

        const data = await response.json()

        if (data.success && Array.isArray(data.data)) {
            return data.data
        }

        return []
    } catch (error) {
        console.error("Error fetching companies:", error)
        return []
    }
}

export async function getAllTags(): Promise<TagItem[]> {
    try {
        const response = await fetch(codeCompileApiEntryPoint + getQuestionTags)
        if (!response.ok) throw new Error("Failed to fetch tags")

        const data = await response.json()

        if (data.success && Array.isArray(data.data)) {
            return data.data
        }

        return []
    } catch (error) {
        console.error("Error fetching tags:", error)
        return []
    }
}
