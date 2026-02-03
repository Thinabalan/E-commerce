import * as yup from "yup";
import { ERROR_MESSAGES, requiredMsg } from "../constants/ErrorMessages";
import { VALIDATION_REGEX } from "../constants/ValidationRegex";
import type { LoginForm, SignupForm } from "../types/AuthenticationTypes";

// Login Validation Schema
export const loginSchema: yup.ObjectSchema<LoginForm> = yup.object({
    email: yup
        .string()
        .required(requiredMsg("Email"))
        .email(ERROR_MESSAGES.emailInvalid),
    password: yup
        .string()
        .required(requiredMsg("Password"))
        .min(6, ERROR_MESSAGES.passwordMin)
}).required();

// Signup Validation Schema
export const signupSchema: yup.ObjectSchema<SignupForm> = yup.object({
    name: yup
        .string()
        .trim()
        .required(requiredMsg("Name"))
        .matches(VALIDATION_REGEX.name, ERROR_MESSAGES.nameInvalid)
        .max(30, ERROR_MESSAGES.nameTooLong),
    email: yup
        .string()
        .required(requiredMsg("Email"))
        .email(ERROR_MESSAGES.emailInvalid),
    password: yup
        .string()
        .required(requiredMsg("Password"))
        .min(6, ERROR_MESSAGES.passwordMin),
    confirmPassword: yup
        .string()
        .required(requiredMsg("Confirm Password"))
        .oneOf([yup.ref("password")], "Passwords must match")
});
