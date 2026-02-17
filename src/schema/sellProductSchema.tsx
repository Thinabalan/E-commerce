import * as yup from "yup";
import type { SellProduct } from "../types/ProductTypes";
import { ERROR_MESSAGES, requiredMsg } from "../constants/ErrorMessages";
import { VALIDATION_REGEX } from "../constants/ValidationRegex";

export const sellProductSchema: yup.ObjectSchema<SellProduct> = yup.object({
    // SELLER INFO
    sellerName: yup
        .string()
        .trim()
        .required(requiredMsg("Name"))
        .matches(VALIDATION_REGEX.name, ERROR_MESSAGES.nameInvalid)
        .min(3, ERROR_MESSAGES.minLength("Name", 3))
        .max(30, ERROR_MESSAGES.maxLength("Name", 30)),

    email: yup
        .string()
        .trim()
        .lowercase()
        .required(requiredMsg("Email"))
        .matches(VALIDATION_REGEX.email, ERROR_MESSAGES.emailInvalid),

    phone: yup
        .string()
        .required(requiredMsg("Phone number"))
        .matches(VALIDATION_REGEX.phone, ERROR_MESSAGES.phoneInvalid,)
        .min(10, ERROR_MESSAGES.phoneMin)
        .max(10, ERROR_MESSAGES.phoneMin),

    sellerType: yup
        .string()
        .oneOf(["individual", "business", ""])
        .required(requiredMsg("Seller type")),

    // BUSINESS INFO (conditional)
    companyName: yup.string().when("sellerType", {
        is: "business",
        then: (schema) => schema
            .trim()
            .required(requiredMsg("Name"))
            .matches(VALIDATION_REGEX.companyName, ERROR_MESSAGES.companyNameInvalid)
            .min(3, ERROR_MESSAGES.minLength("Company name", 3))
            .max(30, ERROR_MESSAGES.maxLength("Company name", 30)),
        otherwise: (schema) => schema.optional(),
    }),

    companyEmail: yup.string().when("sellerType", {
        is: "business",
        then: (schema) =>
            schema
                .trim()
                .lowercase()
                .required(requiredMsg("Email"))
                .matches(VALIDATION_REGEX.email, ERROR_MESSAGES.emailInvalid),
        otherwise: (schema) => schema.optional(),
    }),

    companyPhone: yup.string().when("sellerType", {
        is: "business",
        then: (schema) =>
            schema
                .required(requiredMsg("Phone number"))
                .matches(VALIDATION_REGEX.phone, ERROR_MESSAGES.phoneInvalid)
                .min(10, ERROR_MESSAGES.phoneMin)
                .max(10, ERROR_MESSAGES.phoneMin),
        otherwise: (schema) => schema.optional(),
    }),

    city: yup
        .string()
        .trim()
        .transform((value) => (value === "" ? undefined : value))
        .optional()
        .matches(VALIDATION_REGEX.city, ERROR_MESSAGES.cityInvalid)
        .min(5, ERROR_MESSAGES.minLength("City", 5))
        .max(50, ERROR_MESSAGES.maxLength("City", 50)),

    address: yup
        .string()
        .trim()
        .transform((value) => (value === "" ? undefined : value))
        .optional()
        .min(10, ERROR_MESSAGES.minLength("Address", 10))
        .max(100, ERROR_MESSAGES.maxLength("Address", 100)),

    // PRODUCT INFO
    productName: yup
        .string()
        .trim()
        .required(requiredMsg("Product name"))
        .matches(VALIDATION_REGEX.productName, ERROR_MESSAGES.productNameInvalid)
        .min(3, ERROR_MESSAGES.minLength("Product name", 3))
        .max(50, ERROR_MESSAGES.maxLength("Product name", 50)),

    brand: yup.string()
        .required(requiredMsg("Brand name"))
        .matches(VALIDATION_REGEX.brandName, ERROR_MESSAGES.brandNameInvalid)
        .min(2, ERROR_MESSAGES.minLength("Brand name", 2))
        .max(50, ERROR_MESSAGES.maxLength("Brand name", 50)),

    price: yup
        .number()
        .typeError(ERROR_MESSAGES.priceInvalid)
        .positive("Price must be positive")
        .required(requiredMsg("Price")),

    stock: yup
        .number()
        .typeError(ERROR_MESSAGES.stockInvalid)
        .positive("Stock must be positive")
        .required(requiredMsg("Stock")),

    category: yup.string().required(requiredMsg("Category")),

    condition: yup
        .string()
        .oneOf(["new", "used", ""])
        .required(requiredMsg("Condition")),

    warranty: yup.string().optional(),
    image: yup
        .string()
        .trim()
        .url(ERROR_MESSAGES.imageUrlInvalid)
        .optional(),

    productFeatures: yup
        .array()
        .of(yup.string().required())
        .min(1, "At least one feature must be selected"),

    highlights: yup
        .string()
        .trim()
        .optional()
        .transform((value) => (value === "" ? undefined : value))
        .min(10, ERROR_MESSAGES.minLength("Highlights", 10))
        .max(200, ERROR_MESSAGES.maxLength("Highlights", 200)),

    description: yup
        .string()
        .trim()
        .required(requiredMsg("Description"))
        .matches(VALIDATION_REGEX.description, ERROR_MESSAGES.descriptionInvalid)
        .min(10, ERROR_MESSAGES.minLength("Description", 10))
        .max(1000, ERROR_MESSAGES.maxLength("Description", 1000)),

    // PAYMENT INFO
    paymentMethod: yup
        .string()
        .oneOf(["cod", "upi", "bank", ""] as const)
        .required(requiredMsg("Payment method")),

    upiId: yup.string().when("paymentMethod", {
        is: "upi",
        then: (schema) => schema
            .trim()
            .required(requiredMsg("UPI ID"))
            .matches(VALIDATION_REGEX.upi, ERROR_MESSAGES.upiInvalid)
            .min(5, ERROR_MESSAGES.minLength("UPI ID", 5))
            .max(50, ERROR_MESSAGES.maxLength("UPI ID", 50)),
        otherwise: (schema) => schema.optional(),
    }),

    accountName: yup.string().when("paymentMethod", {
        is: "bank",
        then: (schema) => schema
            .trim()
            .required(requiredMsg("Account name"))
            .matches(VALIDATION_REGEX.accountHolderName, ERROR_MESSAGES.accountHolderNameInvalid)
            .min(3, ERROR_MESSAGES.minLength("Account name", 3))
            .max(100, ERROR_MESSAGES.maxLength("Account name", 100)),
        otherwise: (schema) => schema.optional(),
    }),

    accountNumber: yup.string().when("paymentMethod", {
        is: "bank",
        then: (schema) => schema
            .required(requiredMsg("Account number"))
            .matches(VALIDATION_REGEX.accountNumber, ERROR_MESSAGES.accountNumberInvalid)
            .min(9, ERROR_MESSAGES.minLength("Account number", 9))
            .max(18, ERROR_MESSAGES.maxLength("Account number", 18)),
        otherwise: (schema) => schema.optional(),
    }),

    ifsc: yup.string().when("paymentMethod", {
        is: "bank",
        then: (schema) => schema
            .trim()
            .required(requiredMsg("IFSC code"))
            .matches(VALIDATION_REGEX.ifscCode, ERROR_MESSAGES.ifscCodeInvalid),
        otherwise: (schema) => schema.optional(),
    }),

    bankName: yup.string().when("paymentMethod", {
        is: "bank",
        then: (schema) => schema
            .trim()
            .required(requiredMsg("Bank name"))
            .matches(VALIDATION_REGEX.bankName, ERROR_MESSAGES.bankNameInvalid)
            .min(3, ERROR_MESSAGES.minLength("Bank name", 3))
            .max(100, ERROR_MESSAGES.maxLength("Bank name", 100)),
        otherwise: (schema) => schema.optional(),
    }),

    paymentNotes: yup.string().optional(),

});
