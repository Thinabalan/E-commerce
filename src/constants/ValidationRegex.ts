export const VALIDATION_REGEX = {
  name: /^[A-Za-z ]+$/,
  price: /^[\d,]+(\.\d+)?$/,
  stock: /^[\d,]+$/,
  phone: /^\d{10}$/,
  productName: /^[A-Za-z0-9\s&\'\.,\-]+$/,
  pincode: /^\d{6}$/,
};
