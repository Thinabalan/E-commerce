import { userService } from "../services/userService";
import type { User, CreateUser, LoginForm } from "../types/AuthenticationTypes";

export const useUser = () => {
    // Fetch users 
    const getUsers = async (params: Partial<LoginForm>): Promise<User[]> => {
        try {
            return (await userService.getUsers(params)) || [];
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    };

    // Create user
    const createUser = async (userData: CreateUser): Promise<User> => {
        try {
            return await userService.createUser(userData);
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    };

    return {
        getUsers,
        createUser,
    };
};

export default useUser;
