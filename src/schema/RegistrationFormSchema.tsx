import * as yup from "yup";
import { ERROR_MESSAGES, positive, requiredMsg } from "../constants/ErrorMessages";
import { VALIDATION_REGEX } from "../constants/ValidationRegex";
import type { RegistrationForm } from "../types/RegistrationFormTypes";

export const RegistrationFormSchema: yup.ObjectSchema<RegistrationForm> = yup.object({
  seller: yup.object({
    name: yup
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
    warehouses: yup
      .array()
      .of(
        yup.object({
          warehouseName: yup
            .string()
            .trim()
            .required(requiredMsg("Warehouse Name"))
            .matches(VALIDATION_REGEX.companyName, ERROR_MESSAGES.warehouseNameInvalid)
            .min(3, ERROR_MESSAGES.minLength("Warehouse Name", 3))
            .max(30, ERROR_MESSAGES.maxLength("Warehouse Name", 30)),
          city: yup
            .string()
            .trim()
            .required(requiredMsg("City"))
            .matches(VALIDATION_REGEX.city, ERROR_MESSAGES.cityInvalid)
            .min(5, ERROR_MESSAGES.minLength("City", 5))
            .max(50, ERROR_MESSAGES.maxLength("City", 50)),
          pincode: yup
            .string()
            .trim()
            .required(requiredMsg("Pincode"))
            .matches(VALIDATION_REGEX.pincode, ERROR_MESSAGES.pincodeInvalid),
          upload: yup.mixed().optional().notRequired(),
        })
      )
      .required()
      .min(1, ERROR_MESSAGES.warehouseMin),
    notes: yup.string().optional(),
  }),

  businesses: yup
    .array()
    .of(
      yup.object({
        businessName: yup
          .string()
          .trim()
          .required(requiredMsg("Business Name"))
          .matches(VALIDATION_REGEX.companyName, ERROR_MESSAGES.businessNameInvalid)
          .min(3, ERROR_MESSAGES.minLength("Business Name", 3))
          .max(30, ERROR_MESSAGES.maxLength("Business Name", 30)),
        businessEmail: yup
          .string()
          .trim()
          .lowercase()
          .required(requiredMsg("Email"))
          .matches(VALIDATION_REGEX.email, ERROR_MESSAGES.emailInvalid),
        products: yup
          .array()
          .of(
            yup.object({
              productName: yup
                .string()
                .trim()
                .required(requiredMsg("Product Name"))
                .matches(VALIDATION_REGEX.productName, ERROR_MESSAGES.productNameInvalid)
                .min(3, ERROR_MESSAGES.minLength("Product Name", 3))
                .max(30, ERROR_MESSAGES.maxLength("Product Name", 30)),
              price: yup
                .string()
                .required(requiredMsg("Price"))
                .matches(VALIDATION_REGEX.price, ERROR_MESSAGES.priceInvalid)
                .max(7, ERROR_MESSAGES.maxLength("Price", 7))
                .test("positive", positive("Price"), (value) => {
                  if (!value) return false;
                  const numericValue = Number(value.replace(/,/g, ""));
                  return numericValue > 0;
                }),
              stock: yup
                .string()
                .required(requiredMsg("Stock"))
                .matches(VALIDATION_REGEX.stock, ERROR_MESSAGES.stockInvalid)
                .max(7, ERROR_MESSAGES.maxLength("Stock", 7))
                .test("positive", positive("Stock"), (value) => {
                  if (!value) return false;
                  const numericValue = Number(value.replace(/,/g, ""));
                  return numericValue > 0;
                }),
              category: yup
                .string()
                .trim()
                .required(requiredMsg("Category"))
                .matches(VALIDATION_REGEX.name, ERROR_MESSAGES.nameInvalid)
                .min(3, ERROR_MESSAGES.minLength("Category", 3))
                .max(30, ERROR_MESSAGES.maxLength("Category", 30)),
            })
          )
          .required()
          .min(1, ERROR_MESSAGES.productMin),
        additionaldetails: yup.string().optional(),
      })
    )
    .required()
    .min(1, ERROR_MESSAGES.businessMin),
});
