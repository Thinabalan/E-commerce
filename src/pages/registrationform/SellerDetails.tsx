import {
    Box,
    Grid,
    Typography,
    IconButton,
    Tooltip,
    Button,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useFormContext } from "react-hook-form";
import EcomTextField from "../../components/newcomponents/EcomTextField";
import EcomButton from "../../components/newcomponents/EcomButton";
import EcomAccordion from "../../components/newcomponents/EcomAccordion";
import { useFormHandlers } from "../../hooks/registrationform/useFormHandlers";
import type { RegistrationForm } from "../../types/RegistrationFormTypes";

type SellerDetailsProps = {
    expanded: boolean;
    onChange: (event: React.SyntheticEvent, isExpanded: boolean) => void;
};

export default function SellerDetails({ expanded, onChange }: SellerDetailsProps) {
    const {
        formState: { errors },
        setValue,
        watch,
    } = useFormContext<RegistrationForm>();

    const {
        warehouseFields: fields,
        addWarehouse: handleAddWarehouse,
        removeWarehouse: remove,
        saveWarehouse: handleSaveWarehouse,
        editWarehouse: handleEditWarehouse,
    } = useFormHandlers();

    return (
        <EcomAccordion
            title="Seller Details"
            isOpen={expanded}
            onToggle={onChange}
            icon={<PersonOutlineIcon />}
            error={!!errors.seller}
        >
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
                                                onClick={() => handleEditWarehouse(index)}
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
                                                    file.name,
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
                                    }} title={file} >
                                        {file}
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
        </EcomAccordion>
    );
}
