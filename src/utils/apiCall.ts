import { apiEntryPoint } from "@/consts";

const handlePostMethod = async (endpoint: string, data: object): Promise<any> => {
  try {
    const response = await fetch(apiEntryPoint + endpoint, {
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

const handleGetMethod = async (endpoint: string): Promise<any> => {
  try {
    const response = await fetch(apiEntryPoint + endpoint, {
      method: "GET",
      credentials: "include",
    });
    return response;
  } catch (err) {
    console.error("Error during login:", err);
    return { message: "Server error, please try again later.", status: 500 };
  }
};

const handlePutMethod = async (endpoint: string, data: object): Promise<any> => {
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
