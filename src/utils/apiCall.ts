import { apiEntryPoint } from "@/consts";

type ApiResponse = Response;

interface ErrorResponse {
  message: string;
  status: number;
}

const handlePostMethod = async (endpoint: string, data: object, params?: string): Promise<ApiResponse | ErrorResponse> => {
  try {    
    console.log("calling post");
    
    const response = await fetch(apiEntryPoint + endpoint + "?" + params, {
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

const handleGetMethod = async (endpoint: string, params?: string): Promise<ApiResponse | ErrorResponse> => {
  try {
    console.log("calling get");
    
    const response = await fetch(apiEntryPoint + endpoint + "?" + params ,{
      method: "GET",
      credentials: "include",
    });
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
    return response;
  } catch (err) {
    console.error("Error during login:", err);
    return { message: "Server error, please try again later.", status: 500 };
  }
};

export { handlePostMethod, handleGetMethod, handlePutMethod };
