import {
	codeAiFeedback,
	codeAihint,
	codeCompileApiEntryPoint,
	codeQuestion,
	codeQuestions,
	codeRunCode,
	codeSubmitCode
} from "@/consts";
import { checkRefresh } from "@/utils/apiCall";

interface ErrorResponse {
	message: string;
	status: number;
}

const handlePostMethod = async (
	endpoint: string,
	data: object
): Promise<Response | ErrorResponse> => {
	try {
		const response = await fetch(codeCompileApiEntryPoint + endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(data), // Send form data as JSON
		});
		if (response.status === 401 || response.status === 403) {
			const refreshValid = await checkRefresh();
			if (refreshValid.status === 200) {
				return handlePostMethod(endpoint, data);
			}
		}
		return response;
	} catch (err) {
		console.error("Error during login:", err);
		return { message: "Server error, please try again later.", status: 500 };
	}
};

const handleGetMethod = async (
	endpoint: string
): Promise<Response | ErrorResponse> => {
	try {
		const response = await fetch(codeCompileApiEntryPoint + endpoint, {
			method: "GET",
			credentials: "include",
		});
		if (response.status === 401 || response.status === 403) {
			const refreshValid = await checkRefresh();
			if (refreshValid.status === 200) {
				return handleGetMethod(endpoint);
			}
		}
		return response;
	} catch (err) {
		console.error("Error during login:", err);
		return { message: "Server error, please try again later.", status: 500 };
	}
};

const handlePutMethod = async (
	endpoint: string,
	data: object
): Promise<Response | ErrorResponse> => {
	try {
		const response = await fetch(codeCompileApiEntryPoint + endpoint, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(data), // Send form data as JSON
		});
		if (response.status === 401 || response.status === 403) {
			const refreshValid = await checkRefresh();
			if (refreshValid.status === 200) {
				return handlePutMethod(endpoint, data);
			}
		}
		return response;
	} catch (err) {
		console.error("Error during login:", err);
		return { message: "Server error, please try again later.", status: 500 };
	}
};

const runTest = async (
	code: string,
	langauge: string,
	questionId: string
): Promise<Response | ErrorResponse> => {
	const data = {
		code: code,
		language: langauge,
		questionId: questionId,
	};
	const response = await handlePostMethod(codeRunCode, data);
	return response;
};

const submitCodeAPI = async (
	code: string,
	langauge: string,
	questionId: string,
	userStatus: string
): Promise<Response | ErrorResponse> => {
	const data = {
		code: code,
		language: langauge,
		questionId: questionId,
		userStatus: userStatus,
	};
	const response = await handlePostMethod(codeSubmitCode, data);
	return response;
};

const getAllQuestions = async (search: string) => {
	const response = await handleGetMethod(codeQuestions + search);
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

const getQuestionById = async (id: string) => {
	const response = await handleGetMethod(`${codeQuestion}/id?id=${id}`);
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

const getQuestionBySlug = async (slug: string) => {
	const response = await handleGetMethod(codeQuestion + `?slug=${slug}`);
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



const getAihint = async (code: string, langauge: string, question: string) => {
	const data = {
		code: code,
		language: langauge,
		question: question,
	}
	const response = await handlePostMethod(codeAihint, data);
	if (response instanceof Response) {
		if (!response.status) {
			return "AI help is not available for this question";
		} else {
			const res = await response.json();
			return res.data;
		}
	}
	return response;
};

const getAiFeedback = async (code: string, langauge: string, question: string, passedTestCases: number, totalTestCases: number) => {
	const data = {
		code: code,
		language: langauge,
		question: question,
		passedTestCases: passedTestCases,
		totalTestCases: totalTestCases,
	}
	const response = await handlePostMethod(codeAiFeedback, data);
	if (response instanceof Response) {
		if (!response.status) {
			return "Smart feedback is not available right now";
		} else {
			const res = await response.json();
			return res.data;
		}
	}
	return response;
};

export {
	runTest,
	submitCodeAPI,
	getAllQuestions,
	getQuestionById,
	getQuestionBySlug,
	handleGetMethod,
	handlePutMethod,
	handlePostMethod,
	getAihint,
	getAiFeedback,
};
