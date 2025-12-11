import Error from "next/error";
import { handlePostMethod } from "../code/apiCalls";
import { aiGenerateEndpoint, aiImproveEndpoint, codeExecute } from "@/consts";

// AI Generate Code - uses dedicated generate endpoint
export const aiGenerateCode = async (language: string, prompt: string) => {
    const data = {
        language: language,
        prompt: prompt,
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
    const data = {
        language: language,
        code: code,
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
