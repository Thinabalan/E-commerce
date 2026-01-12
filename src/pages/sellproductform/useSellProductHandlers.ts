import type { UseFormReturn } from "react-hook-form";
import type { Product } from "../../types/types";
import type { ProductFilters } from "./SellProductFilter";

/* DIALOG STATE TYPE */
export type ConfirmDialogState =
    | { type: "single"; id: string | number; status: "active" | "inactive" }
    | { type: "bulk" };

interface UseSellProductHandlersProps {
    setRows: (rows: Product[]) => void;
    setAppliedFilters: (filters: ProductFilters) => void;
    setConfirmDialog: (state: ConfirmDialogState | null) => void;
    setSelectedIds: (ids: (string | number)[]) => void;
    getValues: UseFormReturn<ProductFilters>["getValues"];
    reset: UseFormReturn<ProductFilters>["reset"];
    confirmDialog: ConfirmDialogState | null;
    selectedIds: (string | number)[];
    activeTab: "active" | "inactive";
    getProducts: () => Promise<Product[]>;
    toggleProductStatus: (id: string | number, status: "active" | "inactive") => Promise<any>;
    Filters: ProductFilters; // Default filters
}

export const useSellProductHandlers = ({
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
    toggleProductStatus,
    Filters,
}: UseSellProductHandlersProps) => {
    /* LOAD PRODUCTS */
    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setRows(data);
        } catch (error) {
            console.error("Failed to load products:", error);
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

    /* TOGGLE STATUS */
    const handleToggleConfirm = async () => {
        if (confirmDialog?.type === "single") {
            await toggleProductStatus(confirmDialog.id, confirmDialog.status);
            setConfirmDialog(null);
            loadProducts();
        }
    };

    /* BULK ACTIONS */
    const handleBulkToggle = () => {
        if (selectedIds.length === 0) return;
        setConfirmDialog({ type: "bulk" });
    };

    const confirmBulkAction = async () => {
        const targetStatus = activeTab === "active" ? "active" : "inactive";

        for (const id of selectedIds) {
            await toggleProductStatus(id, targetStatus);
        }

        setSelectedIds([]);
        setConfirmDialog(null);
        loadProducts();
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
