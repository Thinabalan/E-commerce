import * as yup from "yup";
import { ERROR_MESSAGES, requiredMsg } from "../constants/ErrorMessages";
import { VALIDATION_REGEX } from "../constants/ValidationRegex";
import type { LoginForm, SignupForm } from "../types/AuthenticationTypes";

// Login Validation Schema
export const loginSchema: yup.ObjectSchema<LoginForm> = yup.object({
    email: yup
        .string()
        .trim()
        .lowercase()
        .required(requiredMsg("Email"))
        .matches(VALIDATION_REGEX.email, ERROR_MESSAGES.emailInvalid),
    password: yup
        .string()
        .required(requiredMsg("Password"))
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
        .trim()
        .lowercase()
        .required(requiredMsg("Email"))
        .matches(VALIDATION_REGEX.email, ERROR_MESSAGES.emailInvalid),
    password: yup
        .string()
        .required(requiredMsg("Password"))
        .min(8, ERROR_MESSAGES.passwordMin)
        .matches(/^\S*$/,ERROR_MESSAGES.passwordSpace)
        .matches(/[a-z]/, ERROR_MESSAGES.passwordLowercase)
        .matches(/[A-Z]/, ERROR_MESSAGES.passwordUppercase)
        .matches(/\d/, ERROR_MESSAGES.passwordNumber)
        .matches(/[@$!%*?&]/, ERROR_MESSAGES.passwordSpecial),

    confirmPassword: yup
        .string()
        .required(requiredMsg("Confirm Password"))
        .oneOf([yup.ref("password")], "Passwords must match")
});
