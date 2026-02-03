import { useEffect, useState, useMemo } from "react";
import {

  IconButton,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import { useForm } from "react-hook-form";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import AddIcon from "@mui/icons-material/Add";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { Chip } from "@mui/material";

import useProduct from "../../hooks/useProduct";
import SellProductForm from "./SellProductForm";
import EcomDialog from "../../components/newcomponents/EcomDialog";
import EcomButton from "../../components/newcomponents/EcomButton";
import type { Product } from "../../types/ProductTypes";
import type { Column } from "../../components/newcomponents/EcomTable";
import EcomTable from "../../components/newcomponents/EcomTable";
import EcomTab from "../../components/newcomponents/EcomTab";
import { formatDate } from "../../utils/formatDate";
import SellProductFilter from "./SellProductFilter";
import { useSellProductHandlers, type ConfirmDialogState } from "../../hooks/sellproductform/useSellProductHandlers";
import { dateRange } from "../../utils/dateRange";
import type { ProductFilters } from "../../types/ProductTypes";
import { Filters } from "./data/sellProductDefaults";

const SellProductTable = () => {
  const { getProducts, toggleProductStatus, deleteProduct } = useProduct();

  const [rows, setRows] = useState<Product[]>([]);
  const [appliedFilters, setAppliedFilters] =
    useState<ProductFilters>(Filters);

  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState<Product | null>(null);
  /* DIALOG STATE */
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "inactive" | "draft" | "all" | "groupby">("all");
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [dense, setDense] = useState(false);
  const [isFullViewOpen, setIsFullViewOpen] = useState(false);

  const methods = useForm<ProductFilters>({
    defaultValues: Filters,
  });

  const { reset, getValues } = methods;
  const {
    loadProducts,
    handleSearch,
    handleReset,
    handleBulkToggle,
    handleConfirm,
  } = useSellProductHandlers({
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
  });

  useEffect(() => {
    loadProducts();
  }, []);

  /* CATEGORY & BRAND HELPERS */
  const categories = useMemo(() =>
    Array.from(new Set(rows.map((r) => r.category).filter(Boolean))),
    [rows]
  );

  const brandsByCategory = useMemo(() => (category: string) =>
    Array.from(
      new Set(
        rows
          .filter((r) => r.category === category)
          .map((r) => r.brand)
          .filter(Boolean)
      )
    ),
    [rows]
  );

  /* FILTER */
  /* 1. APPLY SEARCH FILTERS TO ALL ROWS */
  const searchFilteredRows = useMemo(() => {
    return rows.filter((p) => {
      const createdDate = p.createdAt ? new Date(p.createdAt) : null;
      return (
        (!appliedFilters.productName ||
          p.productName?.toLowerCase().includes(appliedFilters.productName.toLowerCase())) &&
        (!appliedFilters.sellerName ||
          p.sellerName?.toLowerCase().includes(appliedFilters.sellerName.toLowerCase())) &&
        (!appliedFilters.email ||
          p.email?.toLowerCase().includes(appliedFilters.email.toLowerCase())) &&
        (!appliedFilters.category ||
          p.category === appliedFilters.category) &&
        (!appliedFilters.brand ||
          p.brand === appliedFilters.brand) &&
        (!appliedFilters.createdAtRange ||
          (createdDate && dateRange(createdDate, appliedFilters.createdAtRange)))
      );
    });
  }, [rows, appliedFilters]);

  /* 2. UPDATE COUNTS BASED ON SEARCH RESULTS */
  const counts = useMemo(() => {
    const active = searchFilteredRows.filter(p =>
      p.status === "active" || (!p.status && p.category)
    ).length;
    const inactive = searchFilteredRows.filter(p => p.status === "inactive").length;
    const draft = searchFilteredRows.filter(p => p.status === "draft").length;
    const all = searchFilteredRows.length;

    return { active, inactive, draft, all };
  }, [searchFilteredRows]);

  /* 3. FILTER BY TAB FOR TABLE DISPLAY */
  const filteredRows = useMemo(() => {
    return searchFilteredRows.filter((p) => {
      if (activeTab === "all" || activeTab === "groupby") return true;
      if (activeTab === "draft") return p.status === "draft";
      if (activeTab === "active") return p.status === "active" || (!p.status && p.category);
      return p.status === "inactive";
    });
  }, [searchFilteredRows, activeTab]);

  const groupedTableRows = useMemo(() => {
    if (activeTab !== "groupby") {
      return filteredRows;
    }

    const map = new Map<string, Product[]>();
    filteredRows.forEach((row) => {
      const key = row.category || "Uncategorized";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(row);
    });

    const result: any[] = [];
    map.forEach((rowsInGroup, category) => {
      result.push({ __group: true, label: category, count: rowsInGroup.length });
      rowsInGroup.forEach((r) => result.push(r));
    });

    return result;
  }, [filteredRows, activeTab]);

  const bulkActions = (
    <>
      {activeTab === "active" ? (
        <Tooltip title={`Deactivate Selected (${selectedIds.length})`}>
          <IconButton color="error" onClick={handleBulkToggle}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : activeTab === "inactive" ? (
        <Tooltip title={`Reactivate Selected (${selectedIds.length})`}>
          <IconButton color="info" onClick={handleBulkToggle}>
            <RestoreIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title={`Delete Selected (${selectedIds.length})`}>
          <IconButton color="error" onClick={handleBulkToggle}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </>
  );

  const columns: Column<Product>[] = [
    { id: "sellerName", label: "Seller Name", align: "left", groupLabel: activeTab === "all" ? "Seller Info" : undefined },
    { id: "email", label: "Email", align: "left", groupLabel: activeTab === "all" ? "Seller Info" : undefined },
    { id: "phone", label: "Phone", align: "center", groupLabel: activeTab === "all" ? "Seller Info" : undefined },
    { id: "productName", label: "Product", align: "left", groupLabel: activeTab === "all" ? "Product Specifications" : undefined },
    { id: "category", label: "Category", align: "left", groupLabel: activeTab === "all" ? "Product Specifications" : undefined },
    { id: "brand", label: "Brand", align: "left", groupLabel: activeTab === "all" ? "Product Specifications" : undefined },
    {
      id: "price",
      label: "Price",
      align: "left",
      render: (row) => (
        <Typography fontWeight="bold" color="success.main">₹{row.price}</Typography>
      )
    },
    {
      id: "stock", label: "Stock", align: "left",
      render: (row) => row.stock ?? "—",
    },
    {
      id: "createdAt",
      label: "Created At",
      align: "center",
      render: (row) =>
        row.createdAt ? formatDate(row.createdAt) : "—",
    },
    {
      id: "status",
      label: "Status",
      align: "center",
      sortable: false,
      render: (row) => (
        <Chip
          label={
            row.status === "draft"
              ? "Draft"
              : row.status === "inactive"
                ? "Inactive"
                : "Active"
          }
          color={
            row.status === "draft"
              ? "warning"
              : row.status === "inactive"
                ? "error"
                : "success"
          }
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      id: "id",
      label: "Actions",
      align: "center",
      sortable: false,
      render: (row) => {
        const status = row.status || "active";
        const isDraft = status === "draft";
        const isActive = status === "active";

        return (
          <>
            {isActive || isDraft ? (
              <Box display="flex" gap={1} whiteSpace="nowrap">
                <Tooltip title="Edit">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setEditData(row);
                      setOpenForm(true);
                    }}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={isDraft ? "Delete Draft" : "Deactivate"}>
                  <IconButton
                    color="error"
                    onClick={() => setConfirmDialog({ type: "single", id: row.id, status: status })}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            ) : (
              <Tooltip title="Reactivate">
                <IconButton
                  color="info"
                  onClick={() => setConfirmDialog({ type: "single", id: row.id, status: status })}>
                  <RestoreIcon />
                </IconButton>
              </Tooltip>
            )}
          </>
        );
      },
    },
  ];

  const tableContent = (
    <>
      <Box mt={2}>
        <EcomTab
          value={activeTab}
          onChange={(val) => {
            setActiveTab(val as "active" | "inactive" | "draft" | "all" | "groupby");
            setSelectedIds([]); // Clear selection when switching tabs
          }}
          tabs={[
            { label: "All", value: "all", count: counts.all },
            { label: "Active", value: "active", count: counts.active },
            { label: "Inactive", value: "inactive", count: counts.inactive },
            { label: "Drafts", value: "draft", count: counts.draft },
            { label: "Group By", value: "groupby", count: counts.all },
          ]}
        />
      </Box>

      <EcomTable
        rows={groupedTableRows}
        columns={columns}
        emptyMessage="No products found matching the filters."
        enableSelection={activeTab !== "all" && activeTab !== "groupby"}
        selected={selectedIds}
        onSelectionChange={setSelectedIds}
        selectedAction={activeTab !== "all" && activeTab !== "groupby" ? bulkActions : undefined}
        dense={dense}
        onDenseChange={setDense}
        disablePagination={activeTab === "groupby"}
        disableSorting={activeTab === "groupby"}
        renderRowDetails={activeTab === "all" ? (row) => (
          <Box p={3} sx={{ backgroundColor: "rgba(0, 0, 0, 0.02)", borderTop: "1px solid rgba(0,0,0,0.05)", m: 0 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold">
              Extended Product Information
            </Typography>
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
              <Box>
                <Typography variant="caption" color="textSecondary">Condition</Typography>
                <Typography variant="body1">{row.condition || "—"}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">Warranty</Typography>
                <Typography variant="body1">{row.warranty || "—"}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">Features</Typography>
                <Typography variant="body1">
                  {row.productFeatures && row.productFeatures.length > 0
                    ? row.productFeatures.join(", ")
                    : "—"}
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : undefined}
      />
    </>
  );

  return (
    <Box p={3}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} sx={{ pt: { xs: '60px', md: '7px' } }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            Manage Inventory
          </Typography>
          <Tooltip title="Open Full Screen">
            <IconButton onClick={() => setIsFullViewOpen(true)} color="primary" size="small">
              <OpenInFullIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <EcomButton
          variant="contained"
          label="Add Product"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditData(null);
            setOpenForm(true);
          }}
          sx={{
            width:{xs:'190px',md:'140px'}
          }}
        />
      </Box>

      {/* FILTER SECTION */}
      <SellProductFilter
        methods={methods}
        categories={categories}
        brandsByCategory={brandsByCategory}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* TABS & TABLE */}
      {tableContent}

      <EcomDialog
        fullScreen
        open={isFullViewOpen}
        onClose={() => setIsFullViewOpen(false)}
        title="Inventory Full View"
        headerSx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          boxShadow: 5,
        }}
      >
        <Box p={3}>
          {tableContent}
        </Box>
      </EcomDialog>

      {/* MODALS */}
      <SellProductForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditData(null);
          loadProducts();
        }}
        editData={editData}
      />

      <EcomDialog
        open={Boolean(confirmDialog)}
        title={
          confirmDialog?.type === "single"
            ? confirmDialog.status === "active"
              ? "Confirm Deactivation"
              : confirmDialog.status === "draft"
                ? "Confirm Deletion"
                : "Confirm Reactivation"
            : activeTab === "active"
              ? "Confirm Bulk Deactivation"
              : activeTab === "inactive"
                ? "Confirm Bulk Reactivation"
                : "Confirm Bulk Deletion"
        }
        description={
          confirmDialog?.type === "single"
            ? confirmDialog.status === "active"
              ? "Are you sure you want to deactivate this product?"
              : confirmDialog.status === "draft"
                ? "Are you sure you want to permanently delete this draft?"
                : "Are you sure you want to reactivate this product?"
            : activeTab === "active"
              ? `Are you sure you want to deactivate ${selectedIds.length} selected products?`
              : activeTab === "inactive"
                ? `Are you sure you want to reactivate ${selectedIds.length} selected products?`
                : `Are you sure you want to delete ${selectedIds.length} selected drafts?`
        }
        confirmText={
          confirmDialog?.type === "single"
            ? confirmDialog.status === "active"
              ? "Deactivate"
              : confirmDialog.status === "draft"
                ? "Delete"
                : "Reactivate"
            : activeTab === "active"
              ? "Deactivate All"
              : activeTab === "inactive"
                ? "Reactivate All"
                : "Delete All"
        }
        onClose={() => setConfirmDialog(null)}
        onConfirm={handleConfirm}

      />
    </Box>
  );
}

export default SellProductTable;