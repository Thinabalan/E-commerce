import { useState, useCallback } from "react";
import { registrationService } from "../../services/registrationService";
import type { RegistrationForm } from "../../types/RegistrationFormTypes";

export const useRegistration = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [registrations, setRegistrations] = useState<(RegistrationForm & { id: string })[]>([]);
    
    const addRegistration = useCallback(async (data: RegistrationForm) => {
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
    }, []);

    const getRegistrationsList = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await registrationService.getRegistrations();
            setRegistrations(data);
            return data;
        } catch (err) {
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getRegistrationById = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await registrationService.getRegistrationById(id);
            return data;
        } catch (err) {
            setError("Failed to fetch registration details.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateRegistration = useCallback(async (id: string, data: RegistrationForm) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await registrationService.updateRegistration(id, data);
            return response;
        } catch (err) {
            setError("Failed to update registration. Please try again.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteRegistration = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await registrationService.deleteRegistration(id);
            setRegistrations((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            setError("Failed to delete registration. Please try again.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { addRegistration, getRegistrationsList, getRegistrationById, updateRegistration, deleteRegistration, registrations, isLoading, error };
};
