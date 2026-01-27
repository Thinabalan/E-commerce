import { useState } from "react";
import { registrationService } from "../../services/registrationService";
import type { RegistrationForm } from "../../types/RegistrationFormTypes";

export const useRegistration = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addRegistration = async (data: RegistrationForm) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await registrationService.registerSeller(data);
            return response;
        } catch (err) {
            setError("Failed to register. Please try again.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { addRegistration, isLoading, error };
};
