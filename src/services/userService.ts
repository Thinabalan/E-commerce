import { apiService } from "./apiService";
import type { User, CreateUser, LoginForm } from "../types/AuthenticationTypes";

export const userService = {
    // Get users 
    getUsers: async (params: Partial<LoginForm>): Promise<User[]> => {
        return apiService.get("users", params);
    },

    // Get user by ID
    getUserById: async (userId: string): Promise<User> => {
        return apiService.get(`users/${userId}`);
    },

    // Create user (Signup)
    createUser: async (data: CreateUser): Promise<User> => {
        return apiService.post("users", data);
    },
};
