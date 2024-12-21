import { apiEntryPoint, refreshToken } from "@/consts";
import { ErrorResponse } from "./commonFunction";

type ApiResponse = Response;

export const checkRefresh = async() => await fetch(apiEntryPoint + refreshToken, {
    method: "GET",
    credentials: "include",
});

const handlePostMethod = async (endpoint: string, data: object, params?: string): Promise<ApiResponse | ErrorResponse> => {
    try {
        const response = await fetch(apiEntryPoint + endpoint + "?" + params, {
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
                return handlePostMethod(endpoint, data, params);
            }
        }
        return response;
    } catch (err) {
        console.error("Error during login:", err);
        return { message: "Server error, please try again later.", status: 500 };
    }
};

const handleGetMethod = async (endpoint: string, params?: string): Promise<ApiResponse | ErrorResponse> => {
    try {
        const response = await fetch(apiEntryPoint + endpoint + "?" + params, {
            method: "GET",
            credentials: "include",
        });
        if (response.status === 401 || response.status === 403) {
            const refreshValid = await checkRefresh();
            if (refreshValid.status === 200) {
                return handleGetMethod(endpoint, params);
            }
        }
        return response;
    } catch (err) {
        console.error("Error during login:", err);
        return { message: "Server error, please try again later.", status: 500 };
    }
};

const handlePutMethod = async (endpoint: string, data: object): Promise<ApiResponse | ErrorResponse> => {
    try {
        const response = await fetch(apiEntryPoint + endpoint, {
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

export { handlePostMethod, handleGetMethod, handlePutMethod };
