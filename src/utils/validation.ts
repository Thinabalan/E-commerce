import { ERROR_MESSAGES } from "../constants/ErrorMessages";

// Validators
export const isName = (name: string) => /^[A-Za-z ]{1,30}$/.test(name);

export const isEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isStrongPassword = (pwd: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%!&*?])[A-Za-z\d@#$%!&*?]{8,}$/.test(pwd);

export const isPhone = (phone: string) => /^\d{10}$/.test(phone);

// Field Validation Helpers
export const validateNameField = (name: string): string => {
    if (!name.trim()) return "Name is required";
    if (!isName(name.trim())) {
        if (name.trim().length > 30) return ERROR_MESSAGES.nameTooLong;
        return ERROR_MESSAGES.nameInvalid;
    }
    return "";
};

export const validateEmailField = (email: string): string => {
    if (!email.trim()) return "Email is required";
    if (!isEmail(email.trim())) return ERROR_MESSAGES.emailInvalid;
    return "";
};

export const validatePasswordField = (password: string): string => {
    if (!password) return "Password is required";
    if (!isStrongPassword(password)) return "Password is weak";
    return "";
};

export const validateConfirmPasswordField = (password: string, confirm: string): string => {
    if (!confirm) return "Confirm Password is required";
    if (password !== confirm) return "Password doesn't match";
    return "";
};

export const validatePhoneField = (phone: string): string => {
    if (!phone?.trim()) return "Phone number is required";
    if (!isPhone(phone.trim())) return ERROR_MESSAGES.phoneInvalid;
    return "";
};

export const validateRequiredField = (val: string, msg: string): string => {
    if (!val || !val.trim()) return msg;
    return "";
};
