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
  useFormContext,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useLocation } from "react-router-dom";
import { RegistrationFormSchema } from "../../schema/RegistrationFormSchema";
import { RegistrationFormDefaultValues } from "./data/RegistrationFormDefaults";
import type { RegistrationForm } from "../../types/RegistrationFormTypes";
import { useFormHandlers } from "../../hooks/registrationform/useFormHandlers";

import EcomButton from "../../components/newcomponents/EcomButton";
import SellerDetails from "./SellerDetails";
import BusinessDetails from "./BusinessDetails";
import { useRegistration } from "../../hooks/registrationform/useRegistration";
import { useEffect } from "react";
import { useUI } from "../../context/UIContext";

function RegistrationFormContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showDialog } = useUI();
  const { isLoading } = useRegistration();

  const {
    expanded,
    handleAccordionChange,
    handleToggleAll,
    fetchRegistrationData,
    handleFormError,
    onSubmit,
    isEditMode,
    id,
  } = useFormHandlers();

  const { handleSubmit, reset } = useFormContext<RegistrationForm>();

  const allPanels = [0, 1];
  const isAllExpanded = allPanels.every((id) => expanded[id]);

  useEffect(() => {
    if (isEditMode && id) {
      if (location.state?.registrationData) {
        reset(location.state.registrationData);
      } else {
        fetchRegistrationData(id);
      }
    } else {
      reset(RegistrationFormDefaultValues);
    }
  }, [id, isEditMode, reset, fetchRegistrationData, location.state]);

  return (
    <Box sx={{ minHeight: "100vh", py: 8, pt: { xs: '90px', md: '20px' } }}>
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
            <Typography variant="h4" fontWeight={600} color="primary.main" sx={{ fontSize: { xs: '1.3rem', md: '1.8rem' } }} gutterBottom>
              {isEditMode ? "Edit Registration" : "Registration Form"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Complete the details below to register your business profile.
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit, handleFormError)} noValidate>
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
                onClick={() => showDialog({
                  title: "Reset Form?",
                  description: "Are you sure you want to clear the form?",
                  confirmText: "Reset",
                  onConfirm: () => {
                    reset();
                  }
                })}
                sx={{ px: 3, py: 1, border: 1 }}
              />
              {isEditMode && (
                <EcomButton
                  label="Cancel"
                  variant="outlined"
                  color="error"
                  onClick={() => showDialog({
                    title: "Discard Changes?",
                    description: "Are you sure you want to discard your changes and go back?",
                    confirmText: "Discard",
                    onConfirm: () => {
                      navigate("/registrations");
                    }
                  })}
                  sx={{ px: 3, py: 1, border: 1 }}
                />
              )}
            </Box>
          </form>
        </Paper>
      </Container>
    </Box >
  );
}

export default function RegistrationForm() {
  const registrationForm = useForm<RegistrationForm>({
    resolver: yupResolver(RegistrationFormSchema),
    mode: "onChange",
    defaultValues: RegistrationFormDefaultValues,
  });

  return (
    <FormProvider {...registrationForm}>
      <RegistrationFormContent />
    </FormProvider>
  );
}
