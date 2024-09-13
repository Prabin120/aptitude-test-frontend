import { deletingStorageValue } from "./localStorageSaving";

// TypeScript type for the login response
interface ApiResponse {
    message: string;
    status?: number | undefined;
    data?:object;
}

const entryPoint = 'http://localhost:8000';

const handlePostMethod = async(endpoint: string, data: object): Promise<ApiResponse>=>{
    try {
        const response = await fetch(entryPoint+endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data), // Send form data as JSON
        });
        const responseData = await response.json();
        if (response.status === 401 || response.status === 403) {
            deletingStorageValue('authenticated');
            deletingStorageValue('user');
        }
        if (response.ok) {
            return {...responseData, status:response.status};
        } else {
            return {message: responseData.message, status:response.status};
        }
    } catch (err) {
        console.error('Error during login:', err);
        return {message: "Server error, please try again later.",status:500};
    }
}

const handleGetMethod = async(endpoint: string): Promise<ApiResponse>=>{
    try {
        const response = await fetch(entryPoint+endpoint, {
            method: 'GET',
            credentials: 'include',
        });
        const responseData = await response.json();       
        if (response.status === 401 || response.status === 403) {
            deletingStorageValue('authenticated');
            deletingStorageValue('user');
        }
        if (response.ok) {
            return {...responseData, status:response.status};
        } else {
            return {message: responseData.message, status:response.status};
        }

    } catch (err) {
        console.error('Error during login:', err);
        return {message: "Server error, please try again later.", status:500};
    }
}

const handlePutMethod = async(endpoint: string, data: object): Promise<ApiResponse>=>{
    try {
        const response = await fetch(entryPoint+endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data), // Send form data as JSON
        });
        const responseData = await response.json();
        if (response.status === 401 || response.status === 403) {
            deletingStorageValue('authenticated');
            deletingStorageValue('user');
        }
        if (response.ok) {
            return {...responseData, status:response.status};
        } else {
            return {message: responseData.message, status:response.status};
        }
    } catch (err) {
        console.error('Error during login:', err);
        return {message: "Server error, please try again later.",status:500};
    }
}

export {handlePostMethod, handleGetMethod, handlePutMethod};