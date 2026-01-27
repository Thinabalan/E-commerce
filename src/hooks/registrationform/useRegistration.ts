import { useState } from "react";
import { registrationService } from "../../services/registrationService";
import type { RegistrationForm } from "../../types/RegistrationFormTypes";

export const useRegistration = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [registrations, setRegistrations] = useState<(RegistrationForm & { id: string })[]>([]);

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

    const getRegistrationsList = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await registrationService.getRegistrations();
            setRegistrations(data);
            return data;
        } catch (err) {
            setError("Failed to fetch registrations.");
        } finally {
            setIsLoading(false);
        }
    };

    return { addRegistration, getRegistrationsList, registrations, isLoading, error };
};
