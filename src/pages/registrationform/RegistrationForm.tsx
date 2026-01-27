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
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegistrationFormSchema } from "../../schema/RegistrationFormSchema";
import { RegistrationFormDefaultValues } from "./data/RegistrationFormDefaults";
import type { RegistrationForm } from "../../types/RegistrationFormTypes";

import EcomButton from "../../components/newcomponents/EcomButton";
import SellerDetails from "./SellerDetails";
import BusinessDetails from "./BusinessDetails";
import { useRegistration } from "../../hooks/registrationform/useRegistration";

export default function RegistrationForm() {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: true, 1: false });

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

  const { addRegistration, isLoading } = useRegistration();

  const handleAccordionChange =
    (panel: number) => (_: any, isExpanded: boolean) => {
      setExpanded((prev) => ({ ...prev, [panel]: isExpanded }));
    };

  const onSubmit = async (data: RegistrationForm) => {
    try {
      await addRegistration(data);
      alert("Form submitted successfully ");
      reset();
    } catch (error) {
      alert("Submission failed. Please try again.");
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
      <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", py: 8 }}>
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
                  sx={{ px: 3, py: 1 }}
                  disabled={isLoading}
                  label={isLoading ? "Submitting..." : "Submit"}
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
