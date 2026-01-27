import type { RegistrationForm } from "../../../types/RegistrationFormTypes"

export const RegistrationFormDefaultValues: RegistrationForm = {
    seller: {
        name: "",
        email: "",
        warehouses: [{ warehouseName: "", city: "", pincode: "", upload: null, isSaved: false }],
        notes: "",
    },
    businesses: [
        {
            businessName: "",
            businessEmail: "",
            products: [{ productName: "", price: "", stock: "", category: "", isSaved: false }],
            additionaldetails: "",
        },
    ],
}