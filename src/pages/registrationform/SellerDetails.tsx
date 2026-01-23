import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Grid,
    Typography,
    IconButton,
    Tooltip,
    Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useFieldArray, useFormContext } from "react-hook-form";
import EcomTextField from "../../components/newcomponents/EcomTextField";
import EcomButton from "../../components/newcomponents/EcomButton";
import type { RegistrationForm } from "../../types/RegistrationFormTypes";

type SellerDetailsProps = {
    expanded: boolean;
    onChange: (event: React.SyntheticEvent, isExpanded: boolean) => void;
};

export default function SellerDetails({ expanded, onChange }: SellerDetailsProps) {
    const {
        control,
        formState: { errors },
        getValues,
        trigger,
        setValue,
        watch,
    } = useFormContext<RegistrationForm>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "seller.warehouses",
    });

    const handleAddWarehouse = async () => {
        const currentWarehouses = getValues("seller.warehouses");
        if (currentWarehouses && currentWarehouses.length >= 3) {
            alert("Maximum 3 warehouses allowed");
            return;
        }

        if (currentWarehouses.length > 0) {
            const lastIndex = currentWarehouses.length - 1;
            const isValid = await trigger(`seller.warehouses.${lastIndex}`);
            if (!isValid) return;
        }
        append({ warehouseName: "", city: "", pincode: "", upload: null, isSaved: false });
    };

    const handleSaveWarehouse = async (warehouseIndex: number) => {
        const isValid = await trigger(`seller.warehouses.${warehouseIndex}`);
        if (isValid) {
            setValue(`seller.warehouses.${warehouseIndex}.isSaved`, true);
        }
    };

    return (
        <Accordion
            expanded={expanded}
            onChange={onChange}
            elevation={2}
            sx={{
                mb: 2,
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
                    <PersonOutlineIcon color={errors.seller ? "error" : "primary"} />
                    <Typography
                        fontWeight={600}
                        color={errors.seller ? "error.main" : "text.primary"}
                    >
                        Seller Details
                    </Typography>
                </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ px: 3, pb: 4 }}>
                <Grid container spacing={3} mt={1}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <EcomTextField
                            name="seller.name"
                            label="Seller Name"
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <EcomTextField
                            name="seller.email"
                            label="Email Address"
                            required
                        />
                    </Grid>
                </Grid>

                <Box mt={4}>
                    <Typography variant="subtitle1" fontWeight={600} mb={2} color="text.primary">
                        Warehouse Locations
                    </Typography>
                    {errors.seller?.warehouses?.message && (
                        <Typography color="error" variant="caption" sx={{ mb: 2, display: 'block' }}>
                            {errors.seller.warehouses.message}
                        </Typography>
                    )}
                    {fields.map((field, index) => {
                        const warehouse = watch(`seller.warehouses.${index}`);
                        const file = warehouse.upload;
                        const isSaved = warehouse.isSaved;

                        const isMissingData = !warehouse.warehouseName || !warehouse.city || !warehouse.pincode;
                        const hasErrors = !!errors.seller?.warehouses?.[index];

                        return (
                            <Box
                                key={field.id}
                                sx={{
                                    mb: 2,
                                    p: 2,
                                    bgcolor: index % 2 === 0 ? "rgba(0,0,0,0.01)" : "transparent",
                                    borderRadius: 2,
                                    border: "1px solid #f0f0f0"
                                }}
                            >
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
                                        Warehouse {index + 1}
                                    </Typography>
                                    <Box display="flex" gap={1}>
                                        {!isSaved ? (
                                            <Tooltip title="Save Warehouse">
                                                <span>
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => handleSaveWarehouse(index)}
                                                        disabled={isMissingData || hasErrors}
                                                        sx={{ bgcolor: "rgba(25, 118, 210, 0.04)" }}
                                                    >
                                                        <SaveIcon fontSize="small" />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title="Edit Warehouse">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => setValue(`seller.warehouses.${index}.isSaved`, false)}
                                                    sx={{ bgcolor: "rgba(25, 118, 210, 0.04)" }}
                                                >
                                                    <EditOutlinedIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}

                                        {fields.length > 1 && (
                                            <Tooltip title="Remove Warehouse">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => remove(index)}
                                                    sx={{ bgcolor: "rgba(211, 47, 47, 0.04)" }}
                                                >
                                                    <DeleteOutlineIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Box>
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <EcomTextField
                                            name={`seller.warehouses.${index}.warehouseName`}
                                            label="Warehouse Name"
                                            required
                                            disabled={isSaved}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <EcomTextField
                                            name={`seller.warehouses.${index}.city`}
                                            label="City"
                                            required
                                            disabled={isSaved}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <EcomTextField
                                            name={`seller.warehouses.${index}.pincode`}
                                            label="Pincode"
                                            required
                                            disabled={isSaved}
                                        />
                                    </Grid>

                                    <Button
                                        component="label"
                                        variant="contained"
                                        disabled={isSaved}
                                        startIcon={<CloudUploadIcon />}
                                        sx={{
                                            height: '56px',
                                            alignSelf: 'start',
                                            textTransform: 'none'
                                        }}
                                    >
                                        Upload File
                                        <input
                                            hidden
                                            type="file"
                                            onChange={(event) => {
                                                const file = event.target.files?.[0];
                                                if (file) {
                                                    setValue(
                                                        `seller.warehouses.${index}.upload`,
                                                        file,
                                                        { shouldValidate: true }
                                                    );
                                                }
                                            }}
                                        />
                                    </Button>
                                    {file && (
                                        <Typography variant="subtitle2" sx={{
                                            mt: 2,
                                            maxWidth: 160,
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }} title={file.name} >
                                            {file.name}
                                        </Typography>
                                    )}
                                </Grid>
                            </Box>
                        );
                    })}
                    <EcomButton
                        label="ADD WAREHOUSE"
                        variant="outlined"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={handleAddWarehouse}
                        sx={{ mt: 1, borderRadius: 2 }}
                    />
                </Box>

                <Box mt={4}>
                    <EcomTextField
                        name="seller.notes"
                        label="Internal Notes"
                        multiline
                        rows={2}
                    />
                </Box>
            </AccordionDetails>
        </Accordion>
    );
}
