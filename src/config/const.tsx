import type { SellProduct } from "../types/types";

export const STEPS = ["Seller Info", "Product Info", "Payment"];

export const STEP_FIELDS: (keyof SellProduct)[][] = [
  [
    "sellerName",
    "email",
    "phone",
    "sellerType",
    "companyName",
    "companyEmail",
    "companyPhone",
    "city",
    "address",
  ],
  [
    "productName",
    "brand",
    "price",
    "stock",
    "category",
    "condition",
    "warranty",
    "image",
    "productFeatures",
    "description",
    "highlights",
  ],
  [
    "paymentMethod",
    "upiId",
    "accountName",
    "accountNumber",
    "ifsc",
    "bankName",
    "paymentNotes",
  ],
];
export const PRODUCT_FEATURES = [
  { label: "Free Delivery", value: "Free Delivery" },
  { label: "Return Available", value: "Return Available" },
  { label: "Cash on Delivery", value: "Cash on Delivery" },
  { label: "Warranty", value: "Warranty" },
];