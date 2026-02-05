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

api.interceptors.response.use(
    (response) => response,
    (error) => {
        let message = "Unexpected error occurred";
        if (error.response) {
            message = error.response.data?.message || `Server Error: ${error.response.status}`;
        } else if (error.request) {
            message = "Network error. Please check your connection.";
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
