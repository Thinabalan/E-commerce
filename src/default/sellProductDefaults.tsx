import type { SellProduct } from "../types/types";

export const sellProductDefaultValues: SellProduct = {
  // Seller Info
  name: "",
  email: "",
  phone: "",
  sellerType: "",
  companyName: "",
  companyEmail: "",
  companyPhone: "",
  city: "",
  address: "",

  // Product Info
  productName: "",
  brand: "",
  price: 0,
  stock: 0,
  category: "",
  warranty: "",
  image: "",
  description: "",
  highlights: "",

  // Payment Info
  paymentMethod: "",
  upiId: "",
  accountName: "",
  accountNumber: "",
  ifsc: "",
  bankName: "",
  paymentNotes: "",
};
