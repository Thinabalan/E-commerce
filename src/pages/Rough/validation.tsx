import * as yup from "yup";

export const validation = yup.object({
  username: yup
    .string()
    .matches(/^[A-Za-z ]{1,30}$/, "Username must contain only letters")
    .required("Username is required"),
   
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),

  phone: yup
    .string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),

  age: yup
    .number()
    .typeError("Age must be a number")
    .min(18, "Age must be at least 18")
    .required("Age is required"),

  dob: yup
    .string()
    .required("Date of birth is required"),

  address: yup
    .string()
    .required("Address is required"),
});
