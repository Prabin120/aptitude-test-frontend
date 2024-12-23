import {
	codeCompileApiEntryPoint,
	codeQuestion,
	codeQuestions,
	codeRunCode,
	codeSubmitCode,
	testCases,
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

const addQuestion = async (data: object) => {
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

const getAllQuestions = async (search: string) => {
	console.log(codeQuestion+search);
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
	const response = await handleGetMethod(`${codeQuestion}?id=${id}`);
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
	const response = await handleGetMethod(`${codeQuestion}/slug?slug=${slug}`);
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

const updateQuestion = async (id: string, data: object) => {
	const response = await handlePutMethod(`${codeQuestion}?id=${id}`, data);
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

const addTestCases = async (data: object) => {
	const response = await handlePostMethod(testCases, data);
	return response;
};
const modifyTestCase = async (id: string, data: object) => {
	const response = await handlePutMethod(`${testCases}?id=${id}`, data);
	if (response instanceof Response) {
		if (response.status === 200 || response.status === 201) {
			return "Test cases added successfully";
		} else {
			const res = await response.json();
			return res.message;
		}
	}
	return "Server error, please try again later.";
};

export {
	runTest,
	submitCodeAPI,
	addQuestion,
	getAllQuestions,
	getQuestionById,
	updateQuestion,
	getQuestionBySlug,
	addTestCases,
	modifyTestCase,
	handleGetMethod,
};
