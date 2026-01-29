import { useFormContext, useFieldArray } from "react-hook-form";
import type { RegistrationForm } from "../../types/RegistrationFormTypes";
import { LIMITS } from "../../constants/RegistrationFormConstants";
import { useSnackbar } from "../../context/SnackbarContext";

export const useFormHandlers = () => {
    const { control, trigger, getValues, setValue } = useFormContext<RegistrationForm>();
    const { showSnackbar } = useSnackbar();

    // Warehouse Handlers
    const warehouseFieldArray = useFieldArray({
        control,
        name: "seller.warehouses",
    });

    const handleAddWarehouse = async () => {
        const currentWarehouses = getValues("seller.warehouses");
        if (currentWarehouses && currentWarehouses.length >= LIMITS.warehouse) {
            showSnackbar(`Maximum ${LIMITS.warehouse} warehouses allowed`, "warning");
            return;
        }

        if (currentWarehouses.length > 0) {
            const lastIndex = currentWarehouses.length - 1;
            const isValid = await trigger(`seller.warehouses.${lastIndex}`);
            if (!isValid) return;
        }
        warehouseFieldArray.append({ warehouseName: "", city: "", pincode: "", upload: null, isSaved: false });
    };

    const handleSaveWarehouse = async (index: number) => {
        const isValid = await trigger(`seller.warehouses.${index}`);
        if (isValid) {
            setValue(`seller.warehouses.${index}.isSaved`, true);
        }
    };

    const handleEditWarehouse = (index: number) => {
        setValue(`seller.warehouses.${index}.isSaved`, false);
    };

    // Business Handlers
    const businessFieldArray = useFieldArray({
        control,
        name: "businesses",
    });

    const handleAddBusiness = async () => {
        const currentBusinesses = getValues("businesses");
        if (currentBusinesses && currentBusinesses.length >= LIMITS.business) {
            showSnackbar(`Maximum ${LIMITS.business} businesses allowed`, "warning");
            return;
        }

        if (currentBusinesses.length > 0) {
            const lastIndex = currentBusinesses.length - 1;
            const isValid = await trigger(`businesses.${lastIndex}`);
            if (!isValid) return;
        }

        businessFieldArray.append({
            businessName: "",
            businessEmail: "",
            products: [{ productName: "", price: "", stock: "", category: "", isSaved: false }],
            additionaldetails: "",
        });
    };

    // Product Handlers 
    const getProductHandlers = (bIndex: number) => {
        const { fields, append, remove } = useFieldArray({
            control,
            name: `businesses.${bIndex}.products`,
        });

        const handleAddProduct = async () => {
            const currentProducts = getValues(`businesses.${bIndex}.products`);
            if (currentProducts && currentProducts.length >= LIMITS.product) {
                showSnackbar(`Maximum ${LIMITS.product} products allowed per business`, "warning");
                return;
            }

            if (currentProducts.length > 0) {
                const lastIndex = currentProducts.length - 1;
                const isValid = await trigger(`businesses.${bIndex}.products.${lastIndex}`);
                if (!isValid) return;
            }

            append({ productName: "", price: "", stock: "", category: "", isSaved: false });
        };

        const handleSaveProduct = async (pIndex: number) => {
            const isValid = await trigger(`businesses.${bIndex}.products.${pIndex}`);
            if (isValid) {
                setValue(`businesses.${bIndex}.products.${pIndex}.isSaved`, true);
            }
        };

        const handleEditProduct = (pIndex: number) => {
            setValue(`businesses.${bIndex}.products.${pIndex}.isSaved`, false);
        };

        return {
            productFields: fields,
            addProduct: handleAddProduct,
            removeProduct: remove,
            saveProduct: handleSaveProduct,
            editProduct: handleEditProduct,
        };
    };

    return {
        warehouseFields: warehouseFieldArray.fields,
        addWarehouse: handleAddWarehouse,
        removeWarehouse: warehouseFieldArray.remove,
        saveWarehouse: handleSaveWarehouse,
        editWarehouse: handleEditWarehouse,

        businessFields: businessFieldArray.fields,
        addBusiness: handleAddBusiness,
        removeBusiness: businessFieldArray.remove,

        getProductHandlers,
    };
};
