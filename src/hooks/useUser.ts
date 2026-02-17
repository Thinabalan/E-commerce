import { userService } from "../services/userService";
import type { User, CreateUser, LoginForm } from "../types/AuthenticationTypes";
import { useUI } from "../context/UIContext";
import { handleError } from "../components/error/HandleError";

export const useUser = () => {
    const { showSnackbar } = useUI();

    // Fetch users 
    const getUsers = async (params: Partial<LoginForm>): Promise<User[]> => {
        try {
            return (await userService.getUsers(params)) || [];
        } catch (error: any) {
            handleError({
                error,
                showSnackbar,
                fallbackMessage: "Failed to fetch users",
            });
            return [];
        }
    };

    // Create user
    const createUser = async (userData: CreateUser): Promise<User | null> => {
        try {
            return await userService.createUser(userData);
        } catch (error: any) {
            handleError({
                error,
                showSnackbar,
                fallbackMessage: "Failed to create user",
            });
            return null;
        }
    };

    return {
        getUsers,
        createUser,
    };
};

export default useUser;
