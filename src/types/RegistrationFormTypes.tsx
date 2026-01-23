export interface Warehouse {
  warehouseName: string;
  city: string;
  pincode: string;
  upload?: any;
  isSaved?: boolean;
}

export interface Product {
  productName: string;
  price: number;
  stock: number;
  category: string;
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