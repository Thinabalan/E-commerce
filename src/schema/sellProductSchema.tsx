import * as yup from "yup";
import type { SellProduct } from "../types/types";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { REGEX } from "../constants/regex";

export const sellProductSchema: yup.ObjectSchema<SellProduct> = yup.object({
    // SELLER INFO
    name: yup
        .string()
        .matches(REGEX.name, ERROR_MESSAGES.nameInvalid)
        .max(30, ERROR_MESSAGES.nameTooLong)
        .required(`Name ${ERROR_MESSAGES.Required}`),

    email: yup
        .string()
        .email(ERROR_MESSAGES.emailInvalid)
        .required(ERROR_MESSAGES.emailRequired),

    phone: yup
        .string()
        .matches(REGEX.phone, ERROR_MESSAGES.phoneInvalid)
        .required(ERROR_MESSAGES.phoneRequired),

    sellerType: yup
        .string()
        .oneOf(["individual", "business", ""] as const)
        .required(ERROR_MESSAGES.sellerTypeRequired),

    // BUSINESS INFO (conditional)
    companyName: yup.string().when("sellerType", {
        is: "business",
        then: (schema) => schema.required(ERROR_MESSAGES.companyNameRequired),
        otherwise: (schema) => schema.optional(),
    }),

    companyEmail: yup.string().when("sellerType", {
        is: "business",
        then: (schema) =>
            schema
                .email(ERROR_MESSAGES.companyEmailInvalid)
                .required(ERROR_MESSAGES.companyEmailRequired),
        otherwise: (schema) => schema.optional(),
    }),

    companyPhone: yup.string().when("sellerType", {
        is: "business",
        then: (schema) =>
            schema
                .matches(REGEX.phone, ERROR_MESSAGES.companyPhoneInvalid)
                .required(ERROR_MESSAGES.companyPhoneRequired),
        otherwise: (schema) => schema.optional(),
    }),

    city: yup.string().optional(),
    address: yup.string().optional(),

    // PRODUCT INFO
    productName: yup.string().required(ERROR_MESSAGES.productNameRequired),
    brand: yup.string().required(ERROR_MESSAGES.brandRequired),

    price: yup
        .number()
        .typeError(ERROR_MESSAGES.priceInvalid)
        .positive("Price must be positive")
        .required(ERROR_MESSAGES.priceRequired),

    stock: yup
        .number()
        .typeError(ERROR_MESSAGES.stockInvalid)
        .integer("Stock must be an integer")
        .min(0, "Stock cannot be negative")
        .required(ERROR_MESSAGES.stockRequired),

    category: yup.string().required(ERROR_MESSAGES.categoryRequired),

    warranty: yup.string().optional(),
    image: yup
        .string()
        .trim()
        .url(ERROR_MESSAGES.imageUrlInvalid)
        .optional(),

    highlights: yup.string().optional(),
    description: yup.string().required(ERROR_MESSAGES.descriptionRequired),

    // PAYMENT INFO
    paymentMethod: yup
        .string()
        .oneOf(["cod", "upi", "bank", ""] as const)
        .required(ERROR_MESSAGES.paymentMethodRequired),

    upiId: yup.string().when("paymentMethod", {
        is: "upi",
        then: (schema) => schema.required(ERROR_MESSAGES.upiRequired),
        otherwise: (schema) => schema.optional(),
    }),

    accountName: yup.string().when("paymentMethod", {
        is: "bank",
        then: (schema) => schema.required(ERROR_MESSAGES.accountNameRequired),
        otherwise: (schema) => schema.optional(),
    }),

    accountNumber: yup.string().when("paymentMethod", {
        is: "bank",
        then: (schema) => schema.required(ERROR_MESSAGES.accountNumberRequired),
        otherwise: (schema) => schema.optional(),
    }),

    ifsc: yup.string().when("paymentMethod", {
        is: "bank",
        then: (schema) => schema.required(ERROR_MESSAGES.ifscRequired),
        otherwise: (schema) => schema.optional(),
    }),

    bankName: yup.string().when("paymentMethod", {
        is: "bank",
        then: (schema) => schema.required(ERROR_MESSAGES.bankNameRequired),
        otherwise: (schema) => schema.optional(),
    }),

    paymentNotes: yup.string().optional(),

});
