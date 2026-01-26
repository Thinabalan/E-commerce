export interface Warehouse {
  warehouseName: string;
  city: string;
  pincode: string;
  upload?: any;
  isSaved?: boolean;
}

export interface Product {
  productName: string;
  price: string;
  stock: string;
  category: string;
  isSaved?: boolean;
}

export interface Seller {
  name: string;
  email: string;
  warehouses: Warehouse[];
  notes?: string;
}

export interface Business {
  businessName: string;
  businessEmail: string;
  products: Product[];
  optional?: string;
}
export interface RegistrationForm {
  seller: Seller;
  businesses: Business[];
}