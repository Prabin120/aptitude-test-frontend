import { apiEntryPoint, aptiValidateQuestionIds, codeCompileApiEntryPoint, codeValidateQuestionIds, postTestEndpoint } from "@/consts";
import { checkRefresh, handlePostMethod } from "@/utils/apiCall";


const getVerifyQuestions = async(question_list: string[], keyVal: string, entryPoint: string, endPoint: string) =>{
    try {
        let keyPair = {}
        if(keyVal === "apti") {
            keyPair = {apti:question_list}
        } else {
            keyPair = {coding:question_list}
        }
        const response = await fetch(entryPoint + endPoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(keyPair)
        });
        if (response.status === 401 || response.status === 403) {        
            const refreshValid = await checkRefresh();
            if (refreshValid.status === 200) {
                return getVerifyQuestions(question_list, keyVal, entryPoint, endPoint);
            }
        } 
        return await response.json()        
    } catch (err) {
        console.error("Error during login:", err);
    }
}

const validateQuestion = async (questions: {apti_list: string[], code_list: string[]}) : Promise<{valid: boolean, missingAptiIds: string[], missingCodeIds: string[]}> => {
    const {apti_list, code_list} = questions
    const [resApti, resCode] = await Promise.all([
        getVerifyQuestions(apti_list, "apti", apiEntryPoint, aptiValidateQuestionIds), 
        getVerifyQuestions(code_list, "coding", codeCompileApiEntryPoint, codeValidateQuestionIds)
    ])
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