import { codeCompileApiEntryPoint } from "@/consts";

interface ErrorResponse {
	message: string;
	status: number;
}

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Makes a POST request to the specified endpoint with the given data
 * and returns the response, or an ErrorResponse if the request fails.
 * @param endpoint The endpoint to make the request to.
 * @param data The data to send in the request body.
 * @returns A Promise that resolves to a Response object or an ErrorResponse.
 */
/******  68724f8b-a264-45c2-938d-0bdb383ccb3b  *******/
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
	const response = await handlePostMethod("/run-code", data);
	return response;
};

const submitCodeAPI = async (
	code: string,
	langauge: string,
	questionId: string
	): Promise<Response | ErrorResponse> => {
	const data = {
		code: code,
		language: langauge,
		questionId: questionId,
	};
	const response = await handlePostMethod("/submit-code", data);
	return response;
};

const addQuestion = async (data: object) => {
	const response = await handlePostMethod("/question", data);
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

const getAllQuestions = async () => {
	const response = await handleGetMethod("/questions");
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
	const response = await handleGetMethod(`/question?id=${id}`);
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
	const response = await handleGetMethod(`/question/slug?slug=${slug}`);
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
	const response = await handlePutMethod(`/question?id=${id}`, data);
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
	const response = await handlePostMethod("/test-cases", data);
	return response;
};
const modifyTestCase = async (id: string, data: object) => {
	const response = await handlePutMethod(`/test-cases?id=${id}`, data);
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
};
