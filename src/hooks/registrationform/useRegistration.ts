import { useState, useCallback } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { registrationService } from "../../services/registrationService";
import type { RegistrationForm } from "../../types/RegistrationFormTypes";
import { useUI } from "../../context/UIContext";
import { handleError } from "../../components/error/HandleError";

export const useRegistration = () => {
    const { showSnackbar } = useUI();
    const { showBoundary } = useErrorBoundary();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [registrations, setRegistrations] = useState<(RegistrationForm & { id: string })[]>([]);

    const addRegistration = useCallback(async (data: RegistrationForm) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await registrationService.registerSeller(data);
            return response;
        } catch (err: any) {
            handleError({
                error: err,
                showSnackbar,
                fallbackMessage: "Failed to register",
            });
        } finally {
            setIsLoading(false);
        }
    }, [showSnackbar]);

    const getRegistrationsList = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await registrationService.getRegistrations();
            setRegistrations(data);
            return data;
        } catch (err: any) {
            handleError({
                error: err,
                showBoundary,
                showSnackbar,
                fallbackMessage: "Failed to load list",
            });
            return [];
        } finally {
            setIsLoading(false);
        }
    }, [showBoundary, showSnackbar]);

    const getRegistrationById = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await registrationService.getRegistrationById(id);
            return data;
        } catch (err: any) {
            handleError({
                error: err,
                showSnackbar,
                fallbackMessage: "Failed to fetch registration details",
            });
        } finally {
            setIsLoading(false);
        }
    }, [showSnackbar]);

    const updateRegistration = useCallback(async (id: string, data: RegistrationForm) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await registrationService.updateRegistration(id, data);
            return response;
        } catch (err: any) {
            handleError({
                error: err,
                showSnackbar,
                fallbackMessage: "Failed to update registration",
            });
        } finally {
            setIsLoading(false);
        }
    }, [showSnackbar]);

    const deleteRegistration = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await registrationService.deleteRegistration(id);
            setRegistrations((prev) => prev.filter((r) => r.id !== id));
            return true;
        } catch (err: any) {
            handleError({
                error: err,
                showSnackbar,
                fallbackMessage: "Failed to delete registration",
            });
        } finally {
            setIsLoading(false);
        }
    }, [showSnackbar]);

    return { addRegistration, getRegistrationsList, getRegistrationById, updateRegistration, deleteRegistration, registrations, isLoading, error };
};
