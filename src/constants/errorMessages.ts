export const ERROR_MESSAGES = {

  required: "is required",
  // Name
  nameInvalid: "Name must contain only letters",
  nameTooLong: "Name cannot exceed 30 characters",

  // Email
  emailInvalid: "Enter a valid email address",

  //Password
  passwordMin: "Password must be at least 8 characters.",
  passwordLowercase: "Password must contain a lowercase letter.",
  passwordUppercase: "Password must contain an uppercase letter.",
  passwordNumber: "Password must contain a number.",
  passwordSpecial: "Password must contain a special character (@$!%*?&).",
  passwordSpace:"Password must not contain spaces",

  // Phone
  phoneInvalid: "Phone number must be exactly 10 digits",

  // Product
  priceInvalid: "Price must be a number",
  priceTooLong: "Price value is too long",
  stockInvalid: "Stock must be a number",
  stockTooLong: "Stock value is too long",

  // Positive
  positive: "must be positive",

  imageUrlInvalid: "Enter a valid image URL",

  // Pincode
  pincodeInvalid: "Pincode must be 6 digits",

  // Warehouse
  warehouseMin: "At least one warehouse is required",

  // Product
  productMin: "At least one product is required",

  // Business
  businessMin: "At least one business is required",
};

export const requiredMsg = (label: string) =>
  `${label} ${ERROR_MESSAGES.required}`;

export const positive = (label: string) =>
  `${label} ${ERROR_MESSAGES.positive}`;
