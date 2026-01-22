import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Divider,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  useForm,
  FormProvider,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegistrationFormSchema } from "../../schema/RegistrationFormSchema";
import { RegistrationFormDefaultValues } from "./data/RegistrationFormDefaults";
import type { RegistrationForm } from "../../types/RegistrationFormTypes";

import EcomTextField from "../../components/newcomponents/EcomTextField";
import EcomButton from "../../components/newcomponents/EcomButton";


export default function RegistrationForm() {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: true, 1: false });

  const allPanels = [0, 1];
  const isAllExpanded = allPanels.every((id) => expanded[id]);

  const handleToggleAll = () => {
    const target = !isAllExpanded;
    setExpanded({ 0: target, 1: target });
  };

  const methods = useForm<RegistrationForm>({
    resolver: yupResolver(RegistrationFormSchema),
    mode: "onChange",
    defaultValues: RegistrationFormDefaultValues,
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
    getValues,
    trigger,
  } = methods;

  const warehouses = useFieldArray({
    control,
    name: "seller.warehouses",
  });

  const businesses = useFieldArray({
    control,
    name: "businesses",
  });

  const handleAccordionChange =
    (panel: number) => (_: any, isExpanded: boolean) => {
      setExpanded((prev) => ({ ...prev, [panel]: isExpanded }));
    };

  const onSubmit = (data: RegistrationForm) => {
    console.log(data);
    alert("Form submitted successfully ");
  };

  const onError = (errors: any) => {
    setExpanded((prev) => ({
      ...prev,
      ...(errors.seller && { 0: true }),
      ...(errors.businesses && { 1: true }),
    }));
  };

  const handleAddWarehouse = async () => {
    const currentWarehouses = getValues("seller.warehouses");
    if (currentWarehouses && currentWarehouses.length >= 3) {
      alert("Maximum 3 warehouses allowed");
      return;
    }

    // Trigger validation for the last added warehouse
    if (currentWarehouses.length > 0) {
      const lastIndex = currentWarehouses.length - 1;
      const isValid = await trigger([
        `seller.warehouses.${lastIndex}.warehouseName`,
        `seller.warehouses.${lastIndex}.city`,
        `seller.warehouses.${lastIndex}.pincode`,
      ]);
      if (!isValid) return;
    }

    warehouses.append({ warehouseName: "", city: "", pincode: "", upload: null });
  };

  const handleAddBusiness = async () => {
    const currentBusinesses = getValues("businesses");
    if (currentBusinesses && currentBusinesses.length >= 3) {
      alert("Maximum 3 businesses allowed");
      return;
    }

    // Trigger validation for the last added business
    if (currentBusinesses.length > 0) {
      const lastIndex = currentBusinesses.length - 1;
      const isValid = await trigger([
        `businesses.${lastIndex}.businessName`,
        `businesses.${lastIndex}.businessEmail`,
      ]);
      if (!isValid) return;
    }

    businesses.append({
      businessName: "",
      businessEmail: "",
      products: [{ productName: "", price: 0, stock: 0, category: "" }],
      optional: "",
    });
  };


  return (
    <FormProvider {...methods}>
      <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", py: 2 }}>
        <Container maxWidth="lg">
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, md: 5 },
              maxWidth: 800,
              mx: "auto",
              borderRadius: 4,
              boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
              border: "1px solid #edf2f7",
            }}
          >
            <Box mb={1} textAlign="center">
              <Typography variant="h4" fontWeight={600} color="primary.main" gutterBottom>
                Registration Form
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Complete the details below to register your business profile.
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <EcomButton
                  label={isAllExpanded ? "Collapse All" : "Expand All"}
                  variant="text"
                  onClick={handleToggleAll}
                />
              </Box>
              <Typography variant="h5" fontWeight={600} mb={3} sx={{ display: 'none' }}>
                Seller Details
              </Typography>
              {/* Seller Details */}
              <Accordion
                expanded={!!expanded[0]}
                onChange={handleAccordionChange(0)}
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

                    {errors.seller?.warehouses?.message && (
                      <Typography color="error" variant="caption" sx={{ mb: 2, display: 'block' }}>
                        {errors.seller.warehouses.message as string}
                      </Typography>
                    )}
                    {warehouses.fields.map((field, index) => {
                      const file = methods.watch(`seller.warehouses.${index}.upload`);
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
                              Warehouse Locations - {index + 1}
                            </Typography>
                            {warehouses.fields.length > 1 && (
                              <Tooltip title="Remove Warehouse">
                                <IconButton
                                  color="error"
                                  onClick={() => warehouses.remove(index)}
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
                                name={`seller.warehouses.${index}.warehouseName`}
                                label="Warehouse Name"
                                required
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                              <EcomTextField
                                name={`seller.warehouses.${index}.city`}
                                label="City"
                                required
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                              <EcomTextField
                                name={`seller.warehouses.${index}.pincode`}
                                label="Pincode"
                                required
                              />
                            </Grid>

                            <Button
                              component="label"
                              variant="contained"
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
                                    methods.setValue(
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
                      rows={3}
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Business Details*/}
              <Accordion
                expanded={!!expanded[1]}
                onChange={handleAccordionChange(1)}
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
                    {businesses.fields.map((business, bIndex) => (
                      <BusinessItem
                        key={business.id}
                        index={bIndex}
                        totalBusinesses={businesses.fields.length}
                        control={control}
                        removeBusiness={() => businesses.remove(bIndex)}
                      />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* ACTIONS */}
              <Divider sx={{ my: 4 }} />
              <Box display="flex" justifyContent="center" gap={2}>
                <EcomButton
                  label="Submit"
                  type="submit"
                  variant="contained"
                  sx={{ px: 3, py: 1 }}
                />
                <EcomButton
                  label="Reset"
                  variant="text"
                  color="inherit"
                  onClick={() => reset()}
                  sx={{ px: 3, py: 1, border: 1 }}
                />
              </Box>
            </form>
          </Paper>
        </Container>
      </Box >
    </FormProvider >
  );
}

type BusinessItemProps = {
  index: number;
  totalBusinesses: number;
  control: any;
  removeBusiness: () => void;
};

function BusinessItem({ index, totalBusinesses, control, removeBusiness }: BusinessItemProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `businesses.${index}.products`,
  });

  const { getValues, trigger } = useFormContext();

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
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12 }}>
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
    </Paper >
  );
}
