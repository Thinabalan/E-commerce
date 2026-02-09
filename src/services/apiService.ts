import axios from "axios";

// Base URL
const API_BASE_URL = "http://localhost:5000";

// Axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const ERROR_MESSAGES: Record<number, string> = {
    400: "We couldn't process this request. Please check your information.",
    401: "Your session has expired. Please log in again.",
    403: "You don't have permission to perform this action.",
    404: "We couldn’t complete your request. Please try again.",
    500: "Our servers are having some trouble. We're working on it!",
};

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // SERVER DOWN / NO RESPONSE
        if (!error.response) {
            (error as any).isServerDown = true;
            (error as any).customMessage = "Unable to connect to server. Please check your internet or try again later.";
            return Promise.reject(error);
        }

        const status = error.response.status;

        // RESOURCE NOT FOUND (404)
        if (status === 404) {
            (error as any).isNotFound = true;
            (error as any).customMessage = ERROR_MESSAGES[404];
            return Promise.reject(error);
        }

        // MAPPED MESSAGES (400, 401, 403, 500)
        (error as any).customMessage = ERROR_MESSAGES[status] || error.response.data?.message || "Something went wrong. Please try again.";

        return Promise.reject(error);
    }
);

// API service
export const apiService = {
    async get<T>(url: string, params?: any): Promise<T> {
        const response = await api.get<T>(url, { params });
        return response.data;
    },

    async post<T>(url: string, data?: any): Promise<T> {
        const response = await api.post<T>(url, data);
        return response.data;
    },

    async put<T>(url: string, data?: any): Promise<T> {
        const response = await api.put<T>(url, data);
        return response.data;
    },

    async delete<T>(url: string): Promise<T> {
        const response = await api.delete<T>(url);
        return response.data;
    },

    async patch<T>(url: string, data?: any): Promise<T> {
        const response = await api.patch<T>(url, data);
        return response.data;
    },
};
