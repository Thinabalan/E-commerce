import * as yup from "yup";
import { ERROR_MESSAGES, positive, requiredMsg } from "../constants/ErrorMessages";
import { REGEX } from "../constants/Regex";
import type { RegistrationForm } from "../types/RegistrationFormTypes";

export const RegistrationFormSchema: yup.ObjectSchema<RegistrationForm>  = yup.object({
  seller: yup.object({
    name: yup
      .string()
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
            .required(requiredMsg("Warehouse Name"))
            .max(30, ERROR_MESSAGES.nameTooLong),
          city: yup
            .string()
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
          .required(requiredMsg("Business Name"))
          .matches(REGEX.name, ERROR_MESSAGES.nameInvalid)
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
                .required(requiredMsg("Product Name")),
              price: yup
                .number()
                .typeError(ERROR_MESSAGES.priceInvalid)
                .positive(positive("Price"))
                .required(requiredMsg("Price")),
              stock: yup
                .number()
                .typeError(ERROR_MESSAGES.stockInvalid)
                .positive(positive("Stock"))
                .required(requiredMsg("Stock")),
              category: yup
                .string()
                .required(requiredMsg("Category")),
            })
          )
          .required()
          .min(1, ERROR_MESSAGES.productMin),
        optional: yup.string().optional(),
      })
    )
    .required()
    .min(1, ERROR_MESSAGES.businessMin),
});
