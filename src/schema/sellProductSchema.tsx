import * as yup from "yup";
import type { SellProduct } from "../types/ProductTypes";
import { ERROR_MESSAGES, requiredMsg } from "../constants/ErrorMessages";
import { REGEX } from "../constants/Regex";

export const sellProductSchema: yup.ObjectSchema<SellProduct> = yup.object({
    // SELLER INFO
    sellerName: yup
        .string()
        .required(requiredMsg("Name"))
        .matches(REGEX.name, ERROR_MESSAGES.nameInvalid)
        .max(30, ERROR_MESSAGES.nameTooLong),

    email: yup
        .string()
        .email(ERROR_MESSAGES.emailInvalid)
        .required(requiredMsg("Email")),

    phone: yup
        .string()
        .required(requiredMsg("Phone number"))
        .matches(REGEX.phone, ERROR_MESSAGES.phoneInvalid,),

    sellerType: yup
        .string()
        .oneOf(["individual", "business", ""])
        .required(requiredMsg("Seller type")),

    // BUSINESS INFO (conditional)
    companyName: yup.string().when("sellerType", {
        is: "business",
        then: (schema) => schema
            .required(requiredMsg("Name"))
            .matches(REGEX.name, ERROR_MESSAGES.nameInvalid)
            .max(30, ERROR_MESSAGES.nameTooLong),
        otherwise: (schema) => schema.optional(),
    }),

    companyEmail: yup.string().when("sellerType", {
        is: "business",
        then: (schema) =>
            schema
                .email(ERROR_MESSAGES.emailInvalid)
                .required(requiredMsg("Email")),
        otherwise: (schema) => schema.optional(),
    }),

    companyPhone: yup.string().when("sellerType", {
        is: "business",
        then: (schema) =>
            schema
                .required(requiredMsg("Phone number"))
                .matches(REGEX.phone, ERROR_MESSAGES.phoneInvalid,),
        otherwise: (schema) => schema.optional(),
    }),

    city: yup.string().optional(),
    address: yup.string().optional(),

    // PRODUCT INFO
    productName: yup.string().required(requiredMsg("Product name")),
    brand: yup.string().required(requiredMsg("Brand name")),

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

    highlights: yup.string().optional(),
    description: yup.string().required(requiredMsg("Description")),

    // PAYMENT INFO
    paymentMethod: yup
        .string()
        .oneOf(["cod", "upi", "bank", ""] as const)
        .required(requiredMsg("Payment method")),

    upiId: yup.string().when("paymentMethod", {
        is: "upi",
        then: (schema) => schema.required(requiredMsg("UPI ID")),
        otherwise: (schema) => schema.optional(),
    }),

    accountName: yup.string().when("paymentMethod", {
        is: "bank",
        then: (schema) => schema.required(requiredMsg("Account name")),
        otherwise: (schema) => schema.optional(),
    }),

    accountNumber: yup.string().when("paymentMethod", {
        is: "bank",
        then: (schema) => schema.required(requiredMsg("Account number")),
        otherwise: (schema) => schema.optional(),
    }),

    ifsc: yup.string().when("paymentMethod", {
        is: "bank",
        then: (schema) => schema.required(requiredMsg("IFSC code")),
        otherwise: (schema) => schema.optional(),
    }),

    bankName: yup.string().when("paymentMethod", {
        is: "bank",
        then: (schema) => schema.required(requiredMsg("Bank name")),
        otherwise: (schema) => schema.optional(),
    }),

    paymentNotes: yup.string().optional(),

});
