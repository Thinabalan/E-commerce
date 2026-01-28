import {
    Box,
    Grid,
    Typography,
    IconButton,
    Tooltip,
    Paper,
} from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SaveIcon from '@mui/icons-material/Save';
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useFormContext } from "react-hook-form";
import EcomTextField from "../../components/newcomponents/EcomTextField";
import EcomButton from "../../components/newcomponents/EcomButton";
import EcomTable, { type Column } from "../../components/newcomponents/EcomTable";
import EcomAccordion from "../../components/newcomponents/EcomAccordion";
import { useFormHandlers } from "../../hooks/registrationform/useFormHandlers";
import type { RegistrationForm, Product } from "../../types/RegistrationFormTypes";

type BusinessDetailsProps = {
    expanded: boolean;
    onChange: (event: React.SyntheticEvent, isExpanded: boolean) => void;
};

export default function BusinessDetails({ expanded, onChange }: BusinessDetailsProps) {
    const {
        formState: { errors },
    } = useFormContext<RegistrationForm>();

    const {
        businessFields: fields,
        addBusiness: handleAddBusiness,
        removeBusiness: remove,
        
    } = useFormHandlers();

    return (
        <EcomAccordion
            title="Business Information"
            isOpen={expanded}
            onToggle={onChange}
            icon={<BusinessCenterIcon />}
            error={!!errors.businesses}
        >
            <Box>
                {fields.map((business, bIndex) => (
                    <BusinessItem
                        key={business.id}
                        index={bIndex}
                        totalBusinesses={fields.length}
                        removeBusiness={() => remove(bIndex)}
                    />
                ))}
            </Box>
            <Box mt={1} display="flex" justifyContent="flex-end">
                <EcomButton
                    label="ADD BUSINESS"
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={handleAddBusiness}
                    sx={{ borderRadius: 2 }}
                />
            </Box>
        </EcomAccordion>
    );
}

type BusinessItemProps = {
    index: number;
    totalBusinesses: number;
    removeBusiness: () => void;
};

function BusinessItem({ index, totalBusinesses, removeBusiness }: BusinessItemProps) {
    const { watch, formState: { errors } } = useFormContext<RegistrationForm>();
    const { getProductHandlers } = useFormHandlers();
    const {
        productFields: fields,
        addProduct: handleAddProduct,
        removeProduct: remove,
        saveProduct: handleSaveProduct,
        editProduct: handleEditProduct
    } = getProductHandlers(index);

    const productColumns: Column<Product & { id: string }>[] = [
        {
            id: "productName",
            label: "Product Name",
            align: "left",
            render: (row) => {
                const pIndex = fields.findIndex((f) => f.id === row.id);
                const product = watch(`businesses.${index}.products.${pIndex}`);
                return product?.isSaved ? (
                    <Typography fontWeight={500} fontSize={15} color="text.secondary">
                        {product.productName}
                    </Typography>
                ) : (
                    <EcomTextField
                        name={`businesses.${index}.products.${pIndex}.productName`}
                        size="small"
                        showErrorText={false}
                        required
                    />
                );
            },
        },
        {
            id: "category",
            label: "Category",
            align: "left",
            render: (row) => {
                const pIndex = fields.findIndex((f) => f.id === row.id);
                const product = watch(`businesses.${index}.products.${pIndex}`);
                return product?.isSaved ? (
                    <Typography fontWeight={500} fontSize={15} color="text.secondary">
                        {product.category}
                    </Typography>
                ) : (
                    <EcomTextField
                        name={`businesses.${index}.products.${pIndex}.category`}
                        size="small"
                        showErrorText={false}
                        required
                    />
                );
            },
        },
        {
            id: "price",
            label: "Price",
            align: "left",
            render: (row) => {
                const pIndex = fields.findIndex((f) => f.id === row.id);
                const product = watch(`businesses.${index}.products.${pIndex}`);
                return product?.isSaved ? (
                    <Typography fontWeight={500} fontSize={15} color="text.secondary">
                        {product.price}
                    </Typography>
                ) : (
                    <EcomTextField
                        name={`businesses.${index}.products.${pIndex}.price`}
                        size="small"
                        showErrorText={false}
                        required
                        type="number"
                    />
                );
            },
        },
        {
            id: "stock",
            label: "Stock",
            align: "left",
            render: (row) => {
                const pIndex = fields.findIndex((f) => f.id === row.id);
                const product = watch(`businesses.${index}.products.${pIndex}`);
                return product?.isSaved ? (
                    <Typography fontWeight={500} fontSize={15} color="text.secondary">
                        {product.stock}
                    </Typography>
                ) : (
                    <EcomTextField
                        name={`businesses.${index}.products.${pIndex}.stock`}
                        size="small"
                        showErrorText={false}
                        required
                        type="number"
                    />
                );
            },
        },
        {
            id: "isSaved" as any,
            label: "Actions",
            align: "center",
            render: (row) => {
                const pIndex = fields.findIndex((f) => f.id === row.id);
                const product = watch(`businesses.${index}.products.${pIndex}`);
                const isSaved = product?.isSaved;
                const isMissingData = !product?.productName || !product?.category || product?.price === "" || product?.stock === "";
                const hasErrors = !!errors.businesses?.[index]?.products?.[pIndex];

                return (
                    <Box display="flex" justifyContent="center" gap={0.5}>
                        {!isSaved ? (
                            <Tooltip title="Save Product">
                                <span>
                                    <IconButton
                                        color="primary"
                                        size="small"
                                        onClick={() => handleSaveProduct(pIndex)}
                                        disabled={isMissingData || hasErrors}
                                        sx={{ bgcolor: "rgba(25, 118, 210, 0.04)" }}
                                    >
                                        <SaveIcon fontSize="small" />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        ) : (
                            <Tooltip title="Edit Product">
                                <IconButton
                                    color="primary"
                                    size="small"
                                    onClick={() => handleEditProduct(pIndex)}
                                    sx={{ bgcolor: "rgba(25, 118, 210, 0.04)" }}
                                >
                                    <EditOutlinedIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        {fields.length > 1 && (
                            <Tooltip title="Remove Product">
                                <IconButton
                                    color="error"
                                    size="small"
                                    onClick={() => remove(pIndex)}
                                    sx={{ bgcolor: "rgba(211, 47, 47, 0.04)" }}
                                >
                                    <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                );
            },
        },
    ];

    return (
        <Paper
            elevation={1}
            sx={{
                p: 2,
                mb: 2,
                borderRadius: 3,
                border: "1px solid #edf2f7",
                bgcolor: "#fff",
                position: "relative"
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" fontWeight={700} color="primary.main">
                    Business #{index + 1}
                </Typography>
                {totalBusinesses > 1 && (
                    <Tooltip title="Remove Business">
                        <IconButton
                            color="error"
                            onClick={removeBusiness}
                            sx={{ bgcolor: "rgba(211, 47, 47, 0.04)" }}
                        >
                            <DeleteOutlineIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <EcomTextField
                        name={`businesses.${index}.businessName`}
                        label="Legal Business Name"
                        required
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <EcomTextField
                        name={`businesses.${index}.businessEmail`}
                        label="Business Email Address"
                        required
                    />
                </Grid>
            </Grid>

            <Box mt={2}>
                <Typography variant="subtitle1" fontWeight={600} mb={2} color="text.secondary">
                    Product Inventory
                </Typography>

                <EcomTable
                    rows={fields as any}
                    columns={productColumns as any}
                    disablePagination
                    disableSorting
                    dense
                    emptyMessage="No products added yet."
                />

                <EcomButton
                    label="ADD PRODUCT"
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={handleAddProduct}
                    sx={{ mt: 2, borderRadius: 2 }}
                />
            </Box>

            <Box mt={2}>
                <EcomTextField
                    name={`businesses.${index}.optional`}
                    label="Additional Details (Optional)"
                    multiline
                    rows={2}
                />
            </Box>
        </Paper>
    );
}
