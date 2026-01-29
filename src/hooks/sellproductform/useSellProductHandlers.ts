import type { UseFormReturn } from "react-hook-form";
import type { Product } from "../../types/ProductTypes";
import type { ProductFilters } from "../../types/ProductTypes";
import { useSnackbar } from "../../context/SnackbarContext";

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
    deleteProduct: (id: string | number) => Promise<void>;
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
    const { showSnackbar } = useSnackbar();

    const loadProducts = async () => {
        try {
            const apiProducts = await getProducts();
            setRows(apiProducts);
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

    /* TOGGLE STATUS / DELETE DRAFT */
    const handleToggleConfirm = async () => {
        if (confirmDialog?.type === "single") {
            const product = rows.find(r => r.id === confirmDialog.id);
            const name = product?.productName || "Product";

            if (confirmDialog.status === "draft") {
                await deleteProduct(confirmDialog.id);
                showSnackbar(`Product "${name}" deleted successfully`, "success");
            } else if (confirmDialog.status === "active") {
                await toggleProductStatus(confirmDialog.id, confirmDialog.status);
                showSnackbar(`Product "${name}" deactivated successfully`, "success");
            } else {
                await toggleProductStatus(confirmDialog.id, confirmDialog.status);
                showSnackbar(`Product "${name}" activated successfully`, "success");
            }
            setConfirmDialog(null);
            setSelectedIds([]);
            loadProducts();
        }
    };

    /* BULK ACTIONS */
    const handleBulkToggle = () => {
        if (selectedIds.length === 0) return;
        setConfirmDialog({ type: "bulk" });
    };

    const confirmBulkAction = async () => {
        const count = selectedIds.length;
        if (activeTab === "draft") {
            for (const id of selectedIds) {
                await deleteProduct(id);
            }
            showSnackbar(`${count} drafts deleted successfully`, "success");
        } else {
            const targetStatus = activeTab === "active" ? "active" : "inactive";
            const actionLabel = activeTab === "active" ? "deactivated" : "activated";
            for (const id of selectedIds) {
                await toggleProductStatus(id, targetStatus);
            }
            showSnackbar(`${count} products ${actionLabel} successfully`, "success");
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
