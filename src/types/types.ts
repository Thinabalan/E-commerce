export interface Product {
    id: number | string;
    name: string;
    price: number;
    category: string;
    subcategory?: string;
    brand?: string;
    image: string;
    rating: number;
    description?: string;

    stock?: number;
    warranty?: string;
    highlights?: string;
    returnPolicy?: string;
    productName?: string;
}

export interface SellerInfo {
    name?: string;
    email?: string;
    phone?: string;
    sellerType?: string;
    companyName?: string;
    companyEmail?: string;
    companyPhone?: string;
    city?: string;
    address?: string;
}

export interface PaymentInfo {
    paymentMethod?: string;
    upiId?: string;
    accountName?: string;
    accountNumber?: string;
    ifsc?: string;
    bankName?: string;
    paymentNotes?: string;
}

export interface ProductListing {
    product: CreateProduct;
    seller: SellerInfo;
    payment: PaymentInfo;
}

export interface Category {
    id: number | string;
    name: string;
    icon?: string;
    parentId?: string;
    brands?: string[];
}

export type CreateProduct = Omit<Product, 'id'>;

export interface User {
    id: number | string;
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export type CreateUser = Omit<User, 'id'>;

export type LoginForm = Pick<User, 'email' | 'password'>;

export type SellProduct = {
    name: string;
    email: string;
    phone: string;
    sellerType: "individual" | "business" | "";
    companyName?: string;
    companyEmail?: string;
    companyPhone?: string;
    city?: string;
    address?: string;

    productName: string;
    brand: string;
    price: number;
    stock: number;
    category: string;
    warranty?: string;
    image?: string;
    description: string;
    highlights?: string;
    returnPolicy?: string;

    paymentMethod: "cod" | "upi" | "bank" | "";
    upiId?: string;
    accountName?: string;
    accountNumber?: string;
    ifsc?: string;
    bankName?: string;
    paymentNotes?: string;
}
