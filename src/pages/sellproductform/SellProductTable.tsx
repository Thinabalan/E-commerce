import { useEffect, useState, useMemo } from "react";
import {

  IconButton,
  Box,
  Typography,

  Grid,
  Tooltip,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Chip } from "@mui/material";

import useProduct from "../../hooks/useProduct";
import SellProductForm from "./SellProductForm";
import EcomDialog from "../../components/newcomponents/EcomDialog";
import EcomButton from "../../components/newcomponents/EcomButton";
import EcomTextField from "../../components/newcomponents/EcomTextField";
import EcomDropdown from "../../components/newcomponents/EcomDropdown";
import type { Product } from "../../types/types";
import { CREATED_AT_RANGE } from "../../config/const";
import type { Column } from "../../components/newcomponents/EcomTable";
import EcomTable from "../../components/newcomponents/EcomTable";
import { formatDateOnly } from "../../utils/formatDate";

/* FILTER TYPES */
interface ProductFilters {
  productName: string;
  sellerName: string;
  email: string;
  category: string;
  brand: string;
  createdAtRange: string;
}

const Filters: ProductFilters = {
  productName: "",
  sellerName: "",
  email: "",
  category: "",
  brand: "",
  createdAtRange: "",
};

export default function SellProductTable() {
  const { getProducts, toggleProductStatus } = useProduct();

  const [rows, setRows] = useState<Product[]>([]);
  const [appliedFilters, setAppliedFilters] =
    useState<ProductFilters>(Filters);

  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState<Product | null>(null);
  const [confirmToggle, setConfirmToggle] = useState<{ id: string | number, status: "active" | "inactive" } | null>(null);

  const methods = useForm<ProductFilters>({
    defaultValues: Filters,
  });

  const { watch, reset, getValues } = methods;
  const selectedCategory = watch("category");

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
  const filteredRows = rows.filter((p) => {
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
          <Tooltip title={row.status === "inactive" ? "Cannot edit inactive product" : "Edit"}>
            <span>
              <IconButton
                color="primary"
                disabled={row.status === "inactive"}
                onClick={() => {
                  setEditData(row);
                  setOpenForm(true);
                }}>
                <EditIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={row.status === "inactive" ? "Reactivate" : "Deactivate"}>
            <IconButton
              color={row.status === "inactive" ? "info" : "error"}
              onClick={() => setConfirmToggle({ id: row.id, status: row.status || "active" })}>
              {row.status === "inactive" ? <RestoreIcon /> : <DeleteIcon />}
            </IconButton>
          </Tooltip>
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
      <Box mb={3} p={2} borderRadius={2} bgcolor="background.paper" boxShadow={2}>
        <FormProvider {...methods}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <EcomTextField name="productName" label="Product Name" />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <EcomTextField name="sellerName" label="Seller Name" />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <EcomTextField name="email" label="Email" />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <EcomDropdown
                name="category"
                label="Category"
                displayEmpty
                options={[
                  { value: "", label: "All" },
                  ...categories.map((c) => ({ value: c || "", label: c || "—" })),
                ]}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <EcomDropdown
                name="brand"
                label="Brand"
                displayEmpty
                disabled={!selectedCategory}
                options={[
                  { value: "", label: "All" },
                  ...(selectedCategory
                    ? brandsByCategory(selectedCategory).map((b) => ({
                      value: b || "",
                      label: b || "—",
                    }))
                    : []),
                ]}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <EcomDropdown
                name="createdAtRange"
                label="Created At"
                displayEmpty
                options={CREATED_AT_RANGE}
              />
            </Grid>
          </Grid>
        </FormProvider>

        <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
          <EcomButton
            variant="outlined"
            label="Reset"
            startIcon={<RestartAltIcon />}
            onClick={handleReset}
          />
          <EcomButton
            variant="contained"
            label="Search"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
          />
        </Box>
      </Box>

      {/* TABLE */}
      <EcomTable
        rows={filteredRows}
        columns={columns}
        emptyMessage="No products found matching the filters."
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
    </Box>
  );
}
