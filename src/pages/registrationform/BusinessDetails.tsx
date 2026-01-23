import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Grid,
    Typography,
    IconButton,
    Tooltip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SaveIcon from '@mui/icons-material/Save';
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useFieldArray, useFormContext } from "react-hook-form";
import EcomTextField from "../../components/newcomponents/EcomTextField";
import EcomButton from "../../components/newcomponents/EcomButton";
import type { RegistrationForm } from "../../types/RegistrationFormTypes";

type BusinessDetailsProps = {
    expanded: boolean;
    onChange: (event: React.SyntheticEvent, isExpanded: boolean) => void;
};

export default function BusinessDetails({ expanded, onChange }: BusinessDetailsProps) {
    const {
        control,
        formState: { errors },
        getValues,
        trigger,
    } = useFormContext<RegistrationForm>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "businesses",
    });

    const handleAddBusiness = async () => {
        const currentBusinesses = getValues("businesses");
        if (currentBusinesses && currentBusinesses.length >= 3) {
            alert("Maximum 3 businesses allowed");
            return;
        }

        if (currentBusinesses.length > 0) {
            const lastIndex = currentBusinesses.length - 1;
            const isValid = await trigger(`businesses.${lastIndex}`);
            if (!isValid) return;
        }

        append({
            businessName: "",
            businessEmail: "",
            products: [{ productName: "", price: 0, stock: 0, category: "", isSaved: false }],
            optional: "",
        });
    };

    return (
        <Accordion
            expanded={expanded}
            onChange={onChange}
            elevation={2}
            sx={{
                mb: 3,
                border: "1px solid #edf2f7",
                borderRadius: "12px !important",
                "&:before": { display: "none" },
                overflow: "hidden"
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                    bgcolor: "rgba(25, 118, 210, 0.04)",
                    px: 3,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <BusinessCenterIcon color={errors.businesses ? "error" : "primary"} />
                    <Typography
                        fontWeight={600}
                        color={errors.businesses ? "error.main" : "text.primary"}
                    >
                        Business Information
                    </Typography>
                </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ px: 3, pb: 4, mt: 2}}>
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
            </AccordionDetails>
        </Accordion>
    );
}

type BusinessItemProps = {
    index: number;
    totalBusinesses: number;
    removeBusiness: () => void;
};

function BusinessItem({ index, totalBusinesses, removeBusiness }: BusinessItemProps) {
    const { control, getValues, trigger, watch, setValue, formState: { errors } } = useFormContext<RegistrationForm>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: `businesses.${index}.products`,
    });

    const handleAddProduct = async () => {
        const currentProducts = getValues(`businesses.${index}.products`);
        if (currentProducts && currentProducts.length >= 3) {
            alert("Maximum 3 products allowed per business");
            return;
        }

        if (currentProducts.length > 0) {
            const lastIndex = currentProducts.length - 1;
            const isValid = await trigger(`businesses.${index}.products.${lastIndex}`);
            if (!isValid) return;
        }

        append({ productName: "", price: 0, stock: 0, category: "", isSaved: false });
    };

    return (
        <Paper
            elevation={1}
            sx={{
                p: 2,
                mb: 3,
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

            <Box mt={4}>
                <Typography variant="subtitle1" fontWeight={600} mb={2} color="text.secondary">
                    Product Inventory
                </Typography>
                <TableContainer component={Paper} elevation={1} sx={{ border: "1px solid #f0f0f0", borderRadius: 2 }}>
                    <Table size="small">
                        <TableHead sx={{ bgcolor: "rgba(0,0,0,0.02)" }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>Product Name</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Stock</TableCell>
                                <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {fields.map((productField, pIndex) => {
                                const product = watch(`businesses.${index}.products.${pIndex}`);
                                const isSaved = product?.isSaved;
                                const isMissingData = !product?.productName || !product?.category || product?.price === 0 || product?.stock === 0;
                                const hasErrors = !!errors.businesses?.[index]?.products?.[pIndex];

                                const handleSaveProduct = async () => {
                                    const isValid = await trigger(`businesses.${index}.products.${pIndex}`);
                                    if (isValid) {
                                        setValue(`businesses.${index}.products.${pIndex}.isSaved`, true);
                                    }
                                };

                                return (
                                    <TableRow key={productField.id} hover>
                                        <TableCell sx={{ py: 1.5, verticalAlign: "top" }}>
                                            <EcomTextField
                                                name={`businesses.${index}.products.${pIndex}.productName`}
                                                label="Product Name"
                                                required
                                                disabled={isSaved} />
                                        </TableCell>
                                        <TableCell sx={{ py: 1.5, verticalAlign: "top" }}>
                                            <EcomTextField
                                                name={`businesses.${index}.products.${pIndex}.category`}
                                                label="Category"
                                                required
                                                disabled={isSaved}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ py: 1.5, verticalAlign: "top" }}>
                                            <EcomTextField
                                                name={`businesses.${index}.products.${pIndex}.price`}
                                                label="Price"
                                                required
                                                type="number"
                                                disabled={isSaved}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ py: 1.5,  verticalAlign: "top"}}>
                                            <EcomTextField
                                                name={`businesses.${index}.products.${pIndex}.stock`}
                                                label="Stock"
                                                required
                                                type="number"
                                                disabled={isSaved}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ py: 1.5, textAlign: 'center' }}>
                                            <Box display="flex" justifyContent="center" gap={0.5}>
                                                {!isSaved ? (
                                                    <Tooltip title="Save Product">
                                                        <span>
                                                            <IconButton
                                                                color="primary"
                                                                size="small"
                                                                onClick={handleSaveProduct}
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
                                                            onClick={() => setValue(`businesses.${index}.products.${pIndex}.isSaved`, false)}
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
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                <EcomButton
                    label="ADD PRODUCT"
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={handleAddProduct}
                    sx={{ mt: 2, borderRadius: 2 }}
                />
            </Box>

            <Box mt={4}>
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
