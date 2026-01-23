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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
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
            products: [{ productName: "", price: 0, stock: 0, category: "" }],
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
                        Business Details
                    </Typography>
                </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ px: 3, pb: 4 }}>
                <Box mb={3} mt={1} display="flex" justifyContent="flex-end">
                    <EcomButton
                        label="ADD BUSINESS"
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={handleAddBusiness}
                        sx={{ borderRadius: 2 }}
                    />
                </Box>
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
    const { control, getValues, trigger } = useFormContext<RegistrationForm>();
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
            const isValid = await trigger([
                `businesses.${index}.products.${lastIndex}.productName`,
                `businesses.${index}.products.${lastIndex}.price`,
                `businesses.${index}.products.${lastIndex}.stock`,
                `businesses.${index}.products.${lastIndex}.category`,
            ]);
            if (!isValid) return;
        }

        append({ productName: "", price: 0, stock: 0, category: "" });
    };

    return (
        <Paper
            elevation={1}
            sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                border: "1px solid #edf2f7",
                bgcolor: "#fff",
                position: "relative"
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
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
                {fields.map((product, pIndex) => (
                    <Box
                        key={product.id}
                        sx={{
                            mb: 2,
                            p: 2,
                            bgcolor: "rgba(0,0,0,0.01)",
                            borderRadius: 2,
                            border: "1px solid #f0f0f0"
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
                                Product Inventory - {pIndex + 1}
                            </Typography>
                            {fields.length > 1 && (
                                <Tooltip title="Remove Product">
                                    <IconButton
                                        color="error"
                                        onClick={() => remove(pIndex)}
                                        sx={{ bgcolor: "rgba(211, 47, 47, 0.04)" }}
                                    >
                                        <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <EcomTextField
                                    name={`businesses.${index}.products.${pIndex}.productName`}
                                    label="Product Name"
                                    required
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <EcomTextField
                                    name={`businesses.${index}.products.${pIndex}.category`}
                                    label="Category"
                                    required
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <EcomTextField
                                    name={`businesses.${index}.products.${pIndex}.price`}
                                    label="Price"
                                    type="number"
                                    required
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <EcomTextField
                                    name={`businesses.${index}.products.${pIndex}.stock`}
                                    label="Stock"
                                    type="number"
                                    required
                                />
                            </Grid>
                        </Grid>
                    </Box>
                ))}

                <EcomButton
                    label="ADD PRODUCT"
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={handleAddProduct}
                    sx={{ mt: 1, borderRadius: 2 }}
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
