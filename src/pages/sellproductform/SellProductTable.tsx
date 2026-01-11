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
import { Chip } from "@mui/material";

import useProduct from "../../hooks/useProduct";
import SellProductForm from "./SellProductForm";
import EcomDialog from "../../components/newcomponents/EcomDialog";
import EcomButton from "../../components/newcomponents/EcomButton";
// import EcomTextField from "../../components/newcomponents/EcomTextField";
// import EcomDropdown from "../../components/newcomponents/EcomDropdown";
import type { Product } from "../../types/types";
import type { Column } from "../../components/newcomponents/EcomTable";
import EcomTable from "../../components/newcomponents/EcomTable";
import EcomTab from "../../components/newcomponents/EcomTab";
import { formatDateOnly } from "../../utils/formatDate";
import SellProductFilter, { type ProductFilters } from "./SellProductFilter";

/* FILTER TYPES */
/* FILTER TYPES */
// interface ProductFilters {
//   productName: string;
//   sellerName: string;
//   email: string;
//   category: string;
//   brand: string;
//   createdAtRange: string;
// }

const Filters: ProductFilters = {
  productName: "",
  sellerName: "",
  email: "",
  category: "",
  brand: "",
  createdAtRange: "",
};

const SellProductTable = () => {
  const { getProducts, toggleProductStatus } = useProduct();

  const [rows, setRows] = useState<Product[]>([]);
  const [appliedFilters, setAppliedFilters] =
    useState<ProductFilters>(Filters);

  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState<Product | null>(null);
  const [confirmToggle, setConfirmToggle] = useState<{ id: string | number, status: "active" | "inactive" } | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);

  const methods = useForm<ProductFilters>({
    defaultValues: Filters,
  });

  const { reset, getValues } = methods;
  /* LOAD PRODUCTS */
  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setRows(data);
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  };

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

  /* SEARCH HANDLERS */
  const handleSearch = () => {
    setAppliedFilters(getValues());
  };

  const handleReset = () => {
    reset(Filters);
    setAppliedFilters(Filters);
  };

  const isWithinDateRange = (date: Date, range: string) => {
    const now = new Date();

    switch (range) {
      case "today": {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        return date >= start;
      }

      case "last7": {
        const start = new Date();
        start.setDate(now.getDate() - 7);
        return date >= start;
      }

      case "last30": {
        const start = new Date();
        start.setDate(now.getDate() - 30);
        return date >= start;
      }

      case "thisMonth": {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        return date >= start;
      }

      case "lastMonth": {
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        return date >= start && date <= end;
      }

      default:
        return true;
    }
  };

  /* FILTER */
  const filteredByStatus = useMemo(() => {
    return rows.filter((p) => {
      if (activeTab === "active") {
        return p.status !== "inactive";
      }
      return p.status === "inactive";
    });
  }, [rows, activeTab]);

  const counts = useMemo(() => {
    const active = rows.filter(p => p.status === "active" || !p.status).length;
    const inactive = rows.filter(p => p.status === "inactive").length;
    return { active, inactive };
  }, [rows]);

  const filteredRows = filteredByStatus.filter((p) => {
    const createdDate = p.createdAt ? new Date(p.createdAt) : null;

    return (
      (!appliedFilters.productName ||
        p.productName
          ?.toLowerCase()
          .includes(appliedFilters.productName.toLowerCase())) &&

      (!appliedFilters.sellerName ||
        p.sellerName
          ?.toLowerCase()
          .includes(appliedFilters.sellerName.toLowerCase())) &&

      (!appliedFilters.email ||
        p.email
          ?.toLowerCase()
          .includes(appliedFilters.email.toLowerCase())) &&

      (!appliedFilters.category ||
        p.category === appliedFilters.category) &&

      (!appliedFilters.brand ||
        p.brand === appliedFilters.brand) &&

      (!appliedFilters.createdAtRange ||
        (createdDate &&
          isWithinDateRange(createdDate, appliedFilters.createdAtRange)))
    );
  });

  /* TOGGLE STATUS */
  const handleToggleConfirm = async () => {
    if (confirmToggle) {
      await toggleProductStatus(confirmToggle.id, confirmToggle.status);
      setConfirmToggle(null);
      loadProducts();
    }
  };

  /* BULK ACTIONS */
  const handleBulkToggle = () => {
    if (selectedIds.length === 0) return;
    setBulkConfirmOpen(true);
  };

  const confirmBulkAction = async () => {
    const targetStatus = activeTab === "active" ? "active" : "inactive";

    for (const id of selectedIds) {
      await toggleProductStatus(id, targetStatus);
    }

    setSelectedIds([]);
    setBulkConfirmOpen(false);
    loadProducts();
  };

  const bulkActions = (
    <>
      {activeTab === "active" ? (
        <Tooltip title={`Deactivate Selected (${selectedIds.length})`}>
          <IconButton color="error" onClick={handleBulkToggle}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title={`Reactivate Selected (${selectedIds.length})`}>
          <IconButton color="info" onClick={handleBulkToggle}>
            <RestoreIcon />
          </IconButton>
        </Tooltip>
      )}
    </>
  );

  const columns: Column<Product>[] = [
    { id: "sellerName", label: "Seller Name", align: "left" },
    { id: "email", label: "Email", align: "left" },
    { id: "phone", label: "Phone", align: "center" },
    { id: "productName", label: "Product", align: "left" },
    { id: "category", label: "Category", align: "left" },
    { id: "brand", label: "Brand", align: "left" },
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
        row.createdAt ? formatDateOnly(row.createdAt) : "—",
    },
    {
      id: "status",
      label: "Status",
      align: "center",
      sortable: false,
      render: (row) => (
        <Chip
          label={row.status === "inactive" ? "Inactive" : "Active"}
          color={row.status === "inactive" ? "default" : "success"}
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
      render: (row) => (
        <>
          {activeTab === "active" ? (
            <>
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
              <Tooltip title="Deactivate">
                <IconButton
                  color="error"
                  onClick={() => setConfirmToggle({ id: row.id, status: row.status || "active" })}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Tooltip title="Reactivate">
              <IconButton
                color="info"
                onClick={() => setConfirmToggle({ id: row.id, status: row.status || "active" })}>
                <RestoreIcon />
              </IconButton>
            </Tooltip>
          )}
        </>
      ),
    },
  ];

  return (
    <Box p={3}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          Manage Inventory
        </Typography>

        <EcomButton
          variant="contained"
          label="Add Product"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditData(null);
            setOpenForm(true);
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

      {/* TABS */}
      <EcomTab
        value={activeTab}
        onChange={(val) => {
          setActiveTab(val as "active" | "inactive");
          setSelectedIds([]); // Clear selection when switching tabs
        }}
        tabs={[
          { label: "Active", value: "active", count: counts.active, color: "success" },
          { label: "Inactive", value: "inactive", count: counts.inactive, color: "error" },
        ]}
      />

      {/* TABLE */}
      <EcomTable
        rows={filteredRows}
        columns={columns}
        emptyMessage="No products found matching the filters."
        enableSelection
        selected={selectedIds}
        onSelectionChange={setSelectedIds}
        selectedAction={bulkActions}

      />

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
        open={Boolean(confirmToggle)}
        title={confirmToggle?.status === "active" ? "Confirm Deactivation" : "Confirm Reactivation"}
        description={
          confirmToggle?.status === "active"
            ? "Are you sure you want to deactivate this product?"
            : "Are you sure you want to reactivate this product?"
        }
        confirmText={confirmToggle?.status === "active" ? "Deactivate" : "Reactivate"}
        onClose={() => setConfirmToggle(null)}
        onConfirm={handleToggleConfirm}
        headerSx={{
          borderBottom: "1px solid rgba(0,0,0,0.12)",
        }}
      />

      {/* BULK CONFIRM DIALOG */}
      <EcomDialog
        open={bulkConfirmOpen}
        title={activeTab === "active" ? "Confirm Bulk Deactivation" : "Confirm Bulk Reactivation"}
        description={
          activeTab === "active"
            ? `Are you sure you want to deactivate ${selectedIds.length} selected products?`
            : `Are you sure you want to reactivate ${selectedIds.length} selected products?`
        }
        confirmText={activeTab === "active" ? "Deactivate All" : "Reactivate All"}
        onClose={() => setBulkConfirmOpen(false)}
        onConfirm={confirmBulkAction}
        headerSx={{
          borderBottom: "1px solid rgba(0,0,0,0.12)",
        }}
      />
    </Box>
  );
}

export default SellProductTable;