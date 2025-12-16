import Error from "next/error";
import { handlePostMethod } from "../coding/apiCalls";
import { aiGenerateEndpoint, aiImproveEndpoint, codeExecute } from "@/consts";

const apticode_gemini_key = "apticode_gemini_key";

export const setAIApiKey = (apiKey: string) => {
    localStorage.setItem(apticode_gemini_key, apiKey);
}

export const getAIApiKey = () => {
    return localStorage.getItem(apticode_gemini_key);
}

export const removeAIApiKey = () => {
    localStorage.removeItem(apticode_gemini_key);
}

// AI Generate Code - uses dedicated generate endpoint
export const aiGenerateCode = async (language: string, prompt: string) => {
    const apiKey = getAIApiKey();
    const data = {
        language: language,
        prompt: prompt,
        apiKey: apiKey,
    }
    const response = await handlePostMethod(aiGenerateEndpoint, data);
    if (response instanceof Response) {
        // const res = await response.json();
        return response;
    }
    throw Error;
};

// AI Improve Code - uses dedicated improve endpoint
export const aiImproveCode = async (language: string, code: string) => {
    const apiKey = getAIApiKey();
    const data = {
        language: language,
        code: code,
        apiKey: apiKey,
    }
    const response = await handlePostMethod(aiImproveEndpoint, data);
    if (response instanceof Response) {
        //     const res = await response.json();
        return response;
    }
    throw Error;
};

export const executeCode = async (
    code: string,
    language: string,
    input: string = ""
) => {
    const data = {
        code,
        language,
        input,
    };
    const response = await handlePostMethod(codeExecute, data);
    if (response instanceof Response) {
        try {
            const res = await response.json();
            if (response.status === 200 || response.status === 201) {
                return res.data;
            } else {
                return res.message;
            }
        } catch (e) {
            return "Invalid response from server";
        }
    }
    return "Server error";
};
