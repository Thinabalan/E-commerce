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
};
