import type { SellProduct } from "../types/ProductTypes";

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

export const CREATED_AT_RANGE = [
  { label: "All", value: "" },
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "last7" },
  { label: "Last 30 Days", value: "last30" },
  { label: "This Month", value: "thisMonth" },
  { label: "Last Month", value: "lastMonth" },
]