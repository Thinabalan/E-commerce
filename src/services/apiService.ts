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
    404: "This item is no longer available. It might have been deleted or moved.",
    500: "Our servers are having some trouble. We're working on it!",
};

api.interceptors.response.use(
    (response) => response,
    (error) => {
        let message = "Something went wrong. Please try again later.";

        if (error.response) {
            message = ERROR_MESSAGES[error.response.status] || error.response.data?.message || message;
        } else if (error.request) {
           message = "We’re having trouble connecting right now. Please try again shortly.";
        } else {
            message = error.message;
        }
        return Promise.reject(new Error(message));
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
