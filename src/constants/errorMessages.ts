export const ERROR_MESSAGES = {

  required: "is required",
  // Name
  nameInvalid: "Name must contain only letters and single spaces between words.",

  companyNameInvalid: "Company name may contain letters, numbers, spaces, and the characters . & - ' only",

  // Email
  emailInvalid: "Enter a valid email address",

  //Password
  passwordLowercase: "Password must contain a lowercase letter.",
  passwordUppercase: "Password must contain an uppercase letter.",
  passwordNumber: "Password must contain a number.",
  passwordSpecial: "Password must contain a special character (@$!%*?&).",
  passwordSpace: "Password must not contain spaces",

  // Phone
  phoneInvalid: "Phone number must contain only digits",
  phoneMin: "Phone number must be 10 digits",

  // Product
  priceInvalid: "Price must be a number",

  stockInvalid: "Stock must be a number",

  cityInvalid:"City may contain only letters and spaces",
  
  productNameInvalid: "Product name may include only letters, numbers, spaces, and - ' , . & ( )",

  brandNameInvalid:"Brand name may include only letters, numbers, spaces, and the characters & ' -",

  upiInvalid:"Enter a valid UPI ID (e.g., name@bank)",

  accountHolderNameInvalid:"Account holder name may include only letters, spaces, dot, and apostrophe",

  accountNumberInvalid:"Account number must be 9 to 18 digits",

  ifscCodeInvalid:"Enter a valid IFSC code (e.g., HDFC0001234)",

  bankNameInvalid:"Bank name may include only letters, spaces, and & or dot",
  
  // Positive
  positive: "must be positive",

  imageUrlInvalid: "Enter a valid image URL",

  // Pincode
  pincodeInvalid: "Pincode must be exactly 6 digits",

  // Warehouse
  warehouseNameInvalid:"Warehouse name may include only letters, numbers, spaces, and the characters . & ' -",
  warehouseMin: "At least one warehouse is required",

  // Product
  productMin: "At least one product is required",

  // Business
  businessNameInvalid:"Business name may include only letters, numbers, spaces, and the characters . & ' -",
  businessMin: "At least one business is required",

  minLength: (field: string, min: number) =>
    `${field} must be at least ${min} characters.`,

  maxLength: (field: string, max: number) =>
    `${field} cannot exceed ${max} characters.`,

};

export const requiredMsg = (label: string) =>
  `${label} ${ERROR_MESSAGES.required}`;

export const positive = (label: string) =>
  `${label} ${ERROR_MESSAGES.positive}`;
