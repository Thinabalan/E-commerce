import {
  Box,
  Container,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import {
  useForm,
  FormProvider,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { RegistrationFormSchema } from "../../schema/RegistrationFormSchema";
import { RegistrationFormDefaultValues } from "./data/RegistrationFormDefaults";
import type { RegistrationForm } from "../../types/RegistrationFormTypes";

import EcomButton from "../../components/newcomponents/EcomButton";
import SellerDetails from "./SellerDetails";
import BusinessDetails from "./BusinessDetails";
import { useRegistration } from "../../hooks/registrationform/useRegistration";
import { useEffect, useState } from "react";
import { useSnackbar } from "../../context/SnackbarContext";
import EcomDialog from "../../components/newcomponents/EcomDialog";

export default function RegistrationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showSnackbar } = useSnackbar();
  const isEditMode = Boolean(id);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: true, 1: false });
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const allPanels = [0, 1];
  const isAllExpanded = allPanels.every((id) => expanded[id]);

  const handleToggleAll = () => {
    const target = !isAllExpanded;
    setExpanded({ 0: target, 1: target });
  };

  const registrationForm = useForm<RegistrationForm>({
    resolver: yupResolver(RegistrationFormSchema),
    mode: "onChange",
    defaultValues: RegistrationFormDefaultValues,
  });

  const {
    handleSubmit,
    reset,
  } = registrationForm;

  const { addRegistration, getRegistrationById, updateRegistration, isLoading } = useRegistration();

  useEffect(() => {
    if (isEditMode && id) {
      if (location.state?.registrationData) {
        reset(location.state.registrationData);
        setExpanded({ 0: true, 1: true })
      } else {
        const fetchData = async () => {
          try {
            const data = await getRegistrationById(id);
            reset(data);
            setExpanded({ 0: true, 1: true })
          } catch (error) {
            showSnackbar("Failed to fetch registration data.", "error");
            navigate("/registrations");
          }
        };
        fetchData();

      }
    }
    else {
      reset(RegistrationFormDefaultValues);
    }
  }, [id, isEditMode, reset, getRegistrationById, navigate, location.state]);

  const handleAccordionChange =
    (panel: number) => (_: any, isExpanded: boolean) => {
      setExpanded((prev) => ({ ...prev, [panel]: isExpanded }));
    };

  const onSubmit = async (data: RegistrationForm) => {
    try {
      const processedData = {
        ...data,
        businesses: data.businesses.map((business) => ({
          ...business,
          products: business.products.map((product) => ({
            ...product,
            isSaved: true,
          })),
        })),
      };

      if (isEditMode && id) {
        await updateRegistration(id, processedData);
        showSnackbar("Form updated successfully", "success");
        navigate("/registrations");
      } else {
        await addRegistration(processedData);
        showSnackbar("Form submitted successfully ", "success");
        reset();
      }
    } catch (error) {
      showSnackbar(`${isEditMode ? "Update" : "Submission"} failed. Please try again.`, "error");
    }
  };

  const onError = (errors: any) => {
    setExpanded((prev) => ({
      ...prev,
      ...(errors.seller && { 0: true }),
      ...(errors.businesses && { 1: true }),
    }));
  };

  return (
    <FormProvider {...registrationForm}>
      <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", py: 8, pt: { xs: '90px', lg: '20px' } }}>
        <Container maxWidth="lg">
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, md: 5 },
              maxWidth: 980,
              mx: "auto",
              borderRadius: 4,
              boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
              border: "1px solid #edf2f7",
            }}
          >
            <Box mb={1} textAlign="center">
              <Typography variant="h4" fontWeight={600} color="primary.main" gutterBottom>
                {isEditMode ? "Edit Registration" : "Registration Form"}
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

              <SellerDetails
                expanded={!!expanded[0]}
                onChange={handleAccordionChange(0)}
              />

              <BusinessDetails
                expanded={!!expanded[1]}
                onChange={handleAccordionChange(1)}
              />

              <Divider sx={{ my: 4 }} />
              <Box display="flex" justifyContent="center" gap={2}>
                <EcomButton
                  type="submit"
                  variant="contained"
                  color="success"
                  sx={{ px: 3, py: 1 }}
                  disabled={isLoading}
                  label={isLoading ? (isEditMode ? "Updating..." : "Submitting...") : (isEditMode ? "Update" : "Submit")}
                />
                <EcomButton
                  label="Reset"
                  variant="text"
                  color="inherit"
                  onClick={() => setOpenResetDialog(true)}
                  sx={{ px: 3, py: 1, border: 1 }}
                />
                {isEditMode && (
                  <EcomButton
                    label="Cancel"
                    variant="outlined"
                    color="error"
                    onClick={() => setOpenCancelDialog(true)}
                    sx={{ px: 3, py: 1, border: 1 }}
                  />
                )}
              </Box>
            </form>
          </Paper>
        </Container>
      </Box >
      <EcomDialog
        open={openResetDialog}
        title="Reset Form?"
        description="Are you sure you want to clear the form?"
        confirmText="Reset"
        onClose={() => setOpenResetDialog(false)}
        onConfirm={() => {
          reset();
          setOpenResetDialog(false);
        }}
      />
      <EcomDialog
        open={openCancelDialog}
        title="Discard Changes?"
        description="Are you sure you want to discard your changes and go back?"
        confirmText="Discard"
        onClose={() => setOpenCancelDialog(false)}
        onConfirm={() => {
          setOpenCancelDialog(false);
          navigate("/registrations");
        }}
      />
    </FormProvider >
  );
}
