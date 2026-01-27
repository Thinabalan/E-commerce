import { apiService } from "./apiService";
import type { RegistrationForm } from "../types/RegistrationFormTypes";

export const registrationService = {
    registerSeller: async (data: RegistrationForm): Promise<RegistrationForm> => {
        return apiService.post("registrations", {
            ...data,
            submittedAt: new Date().toISOString(),
        });
    },
};
