export const ERROR_MESSAGES = {
  
  required: "is required",
  // Name
  nameInvalid: "Name must contain only letters",
  nameTooLong: "Name cannot exceed 30 characters",

  // Email
  emailInvalid: "Enter a valid email address",

  // Phone
  phoneInvalid: "Phone number must be exactly 10 digits",

  // Product
  priceInvalid: "Price must be a number",
  stockInvalid: "Stock must be a number",
  
  imageUrlInvalid: "Enter a valid image URL",

};

export const requiredMsg = (label: string) =>
  `${label} ${ERROR_MESSAGES.required}`;
