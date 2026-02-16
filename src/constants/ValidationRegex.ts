export const VALIDATION_REGEX = {
  name: /^[A-Za-z ]+$/,
  email:/^(?!\.)[A-Za-z0-9._%+-]+(?<!\.)@[A-Za-z0-9-]+(\.[A-Za-z]{2,})+$/,
  price: /^[\d,]+(\.\d+)?$/,
  stock: /^[\d,]+$/,
  phone: /^\d{10}$/,
  productName: /^[A-Za-z0-9\s&\'\.,\-]+$/,
  pincode: /^\d{6}$/,
};
