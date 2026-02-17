import type { UseFormReturn } from "react-hook-form";
import type { Product } from "../../types/ProductTypes";
import type { ProductFilters } from "../../types/ProductTypes";
import { useUI } from "../../context/UIContext";

/* DIALOG STATE TYPE */
export type ConfirmDialogState =
    | { type: "single"; id: string | number; status: "active" | "inactive" | "draft" }
    | { type: "bulk" };

interface UseSellProductHandlersProps {
    rows: Product[];
    setRows: (rows: Product[]) => void;
    setAppliedFilters: (filters: ProductFilters) => void;
    setConfirmDialog: (state: ConfirmDialogState | null) => void;
    setSelectedIds: (ids: (string | number)[]) => void;
    getValues: UseFormReturn<ProductFilters>["getValues"];
    reset: UseFormReturn<ProductFilters>["reset"];
    confirmDialog: ConfirmDialogState | null;
    selectedIds: (string | number)[];
    activeTab: "active" | "inactive" | "draft" | "all" | "groupby";
    getProducts: () => Promise<Product[]>;
    deleteProduct: (id: string | number) => Promise<boolean>;
    toggleProductStatus: (id: string | number, status: "active" | "inactive") => Promise<any>;
    Filters: ProductFilters; // Default filters
}

export const useSellProductHandlers = ({
    rows,
    setRows,
    setAppliedFilters,
    setConfirmDialog,
    setSelectedIds,
    getValues,
    reset,
    confirmDialog,
    selectedIds,
    activeTab,
    getProducts,
    deleteProduct,
    toggleProductStatus,
    Filters,
}: UseSellProductHandlersProps) => {
    const { showSnackbar } = useUI();

    const loadProducts = async () => {
        const apiProducts = await getProducts();
        if (apiProducts) {
            setRows(apiProducts);
        }
    };

    /* SEARCH HANDLERS */
    const handleSearch = () => {
        setAppliedFilters(getValues());
    };

    const handleReset = () => {
        reset(Filters);
        setAppliedFilters(Filters);
    };

    /* TOGGLE STATUS / DELETE DRAFT */
    const handleToggleConfirm = async () => {
        if (confirmDialog?.type === "single") {
            const product = rows.find(r => r.id === confirmDialog.id);
            const name = product?.productName || "Product";

            if (confirmDialog.status === "draft") {
                const success = await deleteProduct(confirmDialog.id);
                if (success) {
                    showSnackbar(`Product "${name}" deleted successfully`, "success");
                    setConfirmDialog(null);
                    setSelectedIds([]);
                    loadProducts();
                }
            } else if (confirmDialog.status === "active") {
                const success = await toggleProductStatus(confirmDialog.id, confirmDialog.status);
                if (success) {
                    showSnackbar(`Product "${name}" deactivated successfully`, "success");
                    setConfirmDialog(null);
                    setSelectedIds([]);
                    loadProducts();
                }
            } else {
                const success = await toggleProductStatus(confirmDialog.id, confirmDialog.status);
                if (success) {
                    showSnackbar(`Product "${name}" activated successfully`, "success");
                    setConfirmDialog(null);
                    setSelectedIds([]);
                    loadProducts();
                }
            }
        }
    };

    /* BULK ACTIONS */
    const handleBulkToggle = () => {
        if (selectedIds.length === 0) return;
        setConfirmDialog({ type: "bulk" });
    };

    const confirmBulkAction = async () => {
        const count = selectedIds.length;
        let success = true;

        if (activeTab === "draft") {
            for (const id of selectedIds) {
                const res = await deleteProduct(id);
                if (!res) success = false;
            }
            if (success) {
                showSnackbar(`${count} drafts deleted successfully`, "success");
            }
        } else {
            const targetStatus = activeTab === "active" ? "active" : "inactive";
            const actionLabel = activeTab === "active" ? "deactivated" : "activated";
            for (const id of selectedIds) {
                const res = await toggleProductStatus(id, targetStatus);
                if (!res) success = false;
            }
            if (success) {
                showSnackbar(`${count} products ${actionLabel} successfully`, "success");
            }
        }

        if (success) {
            setSelectedIds([]);
            setConfirmDialog(null);
            loadProducts();
        }
    };

    const handleConfirm = async () => {
        if (confirmDialog?.type === "single") {
            await handleToggleConfirm();
        } else {
            await confirmBulkAction();
        }
    };

    return {
        loadProducts,
        handleSearch,
        handleReset,
        handleBulkToggle,
        handleConfirm,
    };
};
