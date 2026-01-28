import { apiService } from "./apiService";
import type { RegistrationForm } from "../types/RegistrationFormTypes";

export const registrationService = {
    registerSeller: async (data: RegistrationForm): Promise<RegistrationForm> => {
        return apiService.post("registrations", {
            ...data,
            submittedAt: new Date().toISOString(),
        });
    },

    getRegistrations: async (): Promise<(RegistrationForm & { id: string })[]> => {
        return apiService.get("registrations");
    },

    getRegistrationById: async (id: string): Promise<RegistrationForm & { id: string }> => {
        return apiService.get(`registrations/${id}`);
    },

    updateRegistration: async (id: string, data: RegistrationForm): Promise<RegistrationForm> => {
        return apiService.patch(`registrations/${id}`, {
            ...data,
            updatedAt: new Date().toISOString(),
        });
    },
};
