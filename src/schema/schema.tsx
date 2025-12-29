import * as yup from "yup";
import type { SellProductFormInputs } from "../types/types";

export const sellProductSchema: yup.ObjectSchema<SellProductFormInputs> = yup.object({
    // SELLER INFO
    name: yup
        .string()
        .matches(/^[A-Za-z ]{1,30}$/, "Username must contain only letters")
        .required("Seller name is required"),
    email: yup
        .string()   
        .email("Invalid email format")
        .required("Email is required"),
    phone: yup
        .string()
        .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
        .required("Phone number is required"),
    sellerType: yup
        .string()
        .oneOf(["individual", "business", ""] as const)
        .required("Seller type is required"),

    // Conditional Business Info
    companyName: yup.string().when("sellerType", {
        is: "business",
        then: (schema) => schema.required("Company name is required"),
        otherwise: (schema) => schema.optional(),
    }),
    companyEmail: yup.string().when("sellerType", {
        is: "business",
        then: (schema) => schema.email("Invalid company email").required("Company email is required"),
        otherwise: (schema) => schema.optional(),
    }),
    companyPhone: yup.string().when("sellerType", {
        is: "business",
        then: (schema) => schema.matches(/^\d{10}$/, "Company phone must be 10 digits").required("Company phone is required"),
        otherwise: (schema) => schema.optional(),
    }),
    city: yup.string().optional(),
    address: yup.string().optional(),

    // PRODUCT INFO 
    productName: yup
        .string()
        .required("Product name is required"),
    brand: yup
        .string()
        .required("Brand name is required"),
    price: yup
        .number()
        .typeError("Price must be a number")
        .positive("Price must be positive")
        .required("Price is required"),
    stock: yup
        .number()
        .typeError("Stock must be a number")
        .integer("Stock must be an integer")
        .min(0, "Stock cannot be negative")
        .required("Stock quantity is required"),
    category: yup.string().required("Category is required"),
    warranty: yup.string().optional(),
    image: yup.string().url("Invalid image URL").optional(),
    description: yup.string().required("Description is required"),
    highlights: yup.string().optional(),
    returnPolicy: yup.string().optional(),

    // PAYMENT INFO
    paymentMethod: yup.string().oneOf(["cod", "upi", "bank", ""] as const).required("Payment method is required"),

    // Conditional UPI
    upiId: yup.string().when("paymentMethod", {
        is: "upi",
        then: (schema) => schema.required("UPI ID is required"),
        otherwise: (schema) => schema.optional(),
    }),

    // Conditional Bank
    accountName: yup.string().when("paymentMethod", {
        is: "bank",
        then: (schema) => schema.required("Account name is required"),
        otherwise: (schema) => schema.optional(),
    }),
    accountNumber: yup.string().when("paymentMethod", {
        is: "bank",
        then: (schema) => schema.required("Account number is required"),
        otherwise: (schema) => schema.optional(),
    }),
    ifsc: yup.string().when("paymentMethod", {
        is: "bank",
        then: (schema) => schema.required("IFSC code is required"),
        otherwise: (schema) => schema.optional(),
    }),
    bankName: yup.string().when("paymentMethod", {
        is: "bank",
        then: (schema) => schema.required("Bank name is required"),
        otherwise: (schema) => schema.optional(),
    }),
    paymentNotes: yup.string().optional(),
});
