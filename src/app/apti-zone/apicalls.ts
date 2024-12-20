import { getAllAptiQuestionsEndpoint, getAptiQuestionByCategoryEndpoint, getAptiQuestionByCompanyEndpoint, getAptiQuestionByTopicEndpoint, getAptiQuestionEndpoint, getTestsEndpoint } from "@/consts";
import { handleGetMethod } from "@/utils/apiCall";

const getAptiQuestionByTag = async (type: string, tag: string, page: number, limit: number) => {
    let response;
    if(type === "topic"){
        response = await handleGetMethod(getAptiQuestionByTopicEndpoint+"/"+tag, `page=${page}&limit=${limit}`);
    }
    else if(type === "company"){
        response = await handleGetMethod(getAptiQuestionByCompanyEndpoint+"/"+tag, `page=${page}&limit=${limit}`);
    }
    else if(type === "category"){
        response = await handleGetMethod(getAptiQuestionByCategoryEndpoint+"/"+tag, `page=${page}&limit=${limit}`);
    }
    else if(type === "exam"){
        response = await handleGetMethod(getTestsEndpoint + `/${tag}?onlyApti=true`);
    }
    if(!response){
        return "Please choose a valid option";
    }
    if (response instanceof Response) {
        const res = await response.json();
        if (response.status === 200 || response.status === 201) {
            return res;
        } else {
            return res.message;
        }
    }
    return "Server error, please try again later.";
};

const getAllAptiQuestions = async (page: number, limit: number) => {
    const response = await handleGetMethod(getAllAptiQuestionsEndpoint, `page=${page}&limit=${limit}`);
    if (response instanceof Response) {
        const res = await response.json();
        if (response.status === 200 || response.status === 201) {
            return res;
        } else {
            return res.message;
        }
    }
    return "Server error, please try again later.";
};

const getAptiQuestionBySlug = async (slug: string) => {
    const response = await handleGetMethod(`${getAptiQuestionEndpoint}/${slug}`);
    if (response instanceof Response) {
        const res = await response.json();
        if (response.status === 200 || response.status === 201) {
            return res;
        } else {
            return res.message;
        }
    }
    return "Server error, please try again later.";
}

export {getAptiQuestionByTag, getAllAptiQuestions, getAptiQuestionBySlug};