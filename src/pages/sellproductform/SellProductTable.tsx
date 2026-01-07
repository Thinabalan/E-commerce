import { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Box,
  Typography,
  TableContainer,
  Tooltip,
  Grid,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import useProduct from "../../hooks/useProduct";
import SellProductForm from "./SellProductForm";
import EcomDialog from "../../components/newcomponents/EcomDialog";
import EcomButton from "../../components/newcomponents/EcomButton";
import EcomTextField from "../../components/newcomponents/EcomTextField";
import EcomDropdown from "../../components/newcomponents/EcomDropdown";
import type { Product } from "../../types/types";
import { CREATED_AT_RANGE } from "../../config/const";

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
  const { getProducts, deleteProduct } = useProduct();

  const [rows, setRows] = useState<Product[]>([]);
  const [appliedFilters, setAppliedFilters] =
    useState<ProductFilters>(Filters);

  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);

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

  /* DELETE */
  const handleDeleteConfirm = async () => {
    if (deleteId) {
      await deleteProduct(deleteId);
      setDeleteId(null);
      loadProducts();
    }
  };

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
                options={ CREATED_AT_RANGE }
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
      <Box
        sx={{
          height: 500,
          width: "100%",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
          overflow: "hidden",
        }}
      >
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow>
                <TableCell>Seller Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRows.length > 0 ? (
                filteredRows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.sellerName || "—"}</TableCell>
                    <TableCell>{row.email || "—"}</TableCell>
                    <TableCell>{row.phone || "—"}</TableCell>
                    <TableCell>{row.productName || "—"}</TableCell>
                     {/* <Typography variant="caption">
                        Category: {row.category}
                      </Typography> */}
                    <TableCell>{row.category || "—"}</TableCell>
                    <TableCell>{row.brand || "—"}</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "success.main" }}>
                      ₹{row.price}
                    </TableCell>
                    <TableCell>{row.stock ?? "—"}</TableCell>
                    <TableCell>
                      {row.createdAt
                        ? new Date(row.createdAt).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setEditData(row);
                            setOpenForm(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => setDeleteId(row.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 10 }}>
                    <Typography color="textSecondary">
                      No products found matching the filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

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
        open={Boolean(deleteId)}
        title="Confirm Deletion"
        description="Are you sure you want to delete this product?"
        confirmText="Delete"
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
}
