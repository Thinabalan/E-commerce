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
];

export const EXPORT_TABS = [
  { label: "All Products", value: "all" },
  { label: "Active Products", value: "active" },
  { label: "Inactive Products", value: "inactive" },
  { label: "Drafts", value: "draft" },
];

export const EXPORTABLE_COLUMNS = [
    { label: "Seller Name", value: "sellerName" },
    { label: "Email", value: "email" },
    { label: "Phone", value: "phone" },
    { label: "Product Name", value: "productName" },
    { label: "Category", value: "category" },
    { label: "Brand", value: "brand" },
    { label: "Price", value: "price" },
    { label: "Stock", value: "stock" },
    { label: "Created At", value: "createdAt" },
    { label: "Status", value: "status" },
  ];