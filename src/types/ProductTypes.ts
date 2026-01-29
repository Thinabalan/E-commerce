export interface Product extends Partial<SellProduct> {
    id: number | string;
    productName: string;
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
    condition?: "new" | "used" | "";
    productFeatures?: string[];
    createdAt?: string;
    updatedAt?: string;
    status?: "active" | "inactive" | "draft";
}

export type SellProduct = {
    sellerName: string;
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
    condition?: "new" | "used" | "";
    warranty?: string;
    image?: string;
    productFeatures?: string[];
    description: string;
    highlights?: string;

    paymentMethod: "cod" | "upi" | "bank" | "";
    upiId?: string;
    accountName?: string;
    accountNumber?: string;
    ifsc?: string;
    bankName?: string;
    paymentNotes?: string;
}

export type CreateProduct = Omit<Product, 'id'>;

export interface ProductFilters {
    productName: string;
    sellerName: string;
    email: string;
    category: string;
    brand: string;
    createdAtRange: string;
}

export interface Category {
    id: number | string;
    name: string;
    icon?: string;
    parentId?: string;
    brands?: string[];
}




