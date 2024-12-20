import { apiEntryPoint, aptiValidateQuestionIds, codeCompileApiEntryPoint, codeValidateQuestionIds, postTestEndpoint } from "@/consts";
import { handlePostMethod } from "@/utils/apiCall";


const validateQuestion = async (questions: {apti_list: string[], code_list: string[]}) : Promise<{valid: boolean, missingAptiIds: string[], missingCodeIds: string[]}> => {
    const {apti_list, code_list} = questions
    let resApti, resCode
    try {
        const response = await fetch(apiEntryPoint + aptiValidateQuestionIds, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({apti:apti_list}), // Send form data as JSON
        });
        resApti = await response.json()        
    } catch (err) {
        console.error("Error during login:", err);
    }
    try {
        const response = await fetch(codeCompileApiEntryPoint + codeValidateQuestionIds, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({coding:code_list}), // Send form data as JSON
        });
        resCode = await response.json()        
    } catch (err) {
        console.error("Error during login:", err);
    }
    const res = {
        valid : resApti.valid && resCode?.status,
        missingAptiIds : resApti.missingAptiIds?? [],
        missingCodeIds : resCode.data?? []
    }
    return res
}

const createTest = (data: object) => {
    const response = handlePostMethod(postTestEndpoint, data);
    return response
}

export { validateQuestion, createTest }