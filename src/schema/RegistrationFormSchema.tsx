import * as yup from "yup";
import { ERROR_MESSAGES, positive, requiredMsg } from "../constants/ErrorMessages";
import { REGEX } from "../constants/Regex";
import type { RegistrationForm } from "../types/RegistrationFormTypes";

export const RegistrationFormSchema: yup.ObjectSchema<RegistrationForm> = yup.object({
  seller: yup.object({
    name: yup
      .string()
      .trim()
      .required(requiredMsg("Name"))
      .matches(REGEX.name, ERROR_MESSAGES.nameInvalid)
      .max(30, ERROR_MESSAGES.nameTooLong),
    email: yup
      .string()
      .email(ERROR_MESSAGES.emailInvalid)
      .required(requiredMsg("Email")),
    warehouses: yup
      .array()
      .of(
        yup.object({
          warehouseName: yup
            .string()
            .trim()
            .required(requiredMsg("Warehouse Name"))
            .matches(REGEX.name, ERROR_MESSAGES.nameInvalid)
            .max(30, ERROR_MESSAGES.nameTooLong),
          city: yup
            .string()
            .trim()
            .required(requiredMsg("City")),
          pincode: yup
            .string()
            .required(requiredMsg("Pincode"))
            .matches(REGEX.pincode, ERROR_MESSAGES.pincodeInvalid),
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
          .max(30, ERROR_MESSAGES.nameTooLong),
        businessEmail: yup
          .string()
          .email(ERROR_MESSAGES.emailInvalid)
          .required(requiredMsg("Email")),
        products: yup
          .array()
          .of(
            yup.object({
              productName: yup
                .string()
                .trim()
                .required(requiredMsg("Product Name"))
                .max(30, ERROR_MESSAGES.nameTooLong),
              price: yup
                .string()
                .required(requiredMsg("Price"))
                .matches(REGEX.price, ERROR_MESSAGES.priceInvalid)
                .max(7, ERROR_MESSAGES.priceTooLong)
                .test("positive", positive("Price"), (value) => {
                  if (!value) return false;
                  const numericValue = Number(value.replace(/,/g, ""));
                  return numericValue > 0;
                }),
              stock: yup
                .string()
                .required(requiredMsg("Stock"))
                .matches(REGEX.stock, ERROR_MESSAGES.stockInvalid)
                .max(7,ERROR_MESSAGES.stockInvalid)
                .test("positive", positive("Stock"), (value) => {
                  if (!value) return false;
                  const numericValue = Number(value.replace(/,/g, ""));
                  return numericValue > 0;
                }),
              category: yup
                .string()
                .trim()
                .required(requiredMsg("Category"))
                .matches(REGEX.name, ERROR_MESSAGES.nameInvalid)
                .max(30, ERROR_MESSAGES.nameTooLong),
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
