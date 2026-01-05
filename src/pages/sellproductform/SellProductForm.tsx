import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import useProduct from "../../hooks/useProduct";

import EcomButton from "../../components/newcomponents/EcomButton";
import EcomStepper from "../../components/newcomponents/EcomStepper";
import EcomSnackbar from "../../components/newcomponents/EcomSnackbar";
import EcomDialog from "../../components/newcomponents/EcomDialog";

import SellerInfoStep from "./SellerInfoStep";
import ProductInfoStep from "./ProductInfoStep";
import PaymentStep from "./PaymentStep";

import { sellProductSchema } from "../../schema/sellProductSchema";
import { sellProductDefaultValues } from "../../default/sellProductDefaults";
import type { Category, SellProduct } from "../../types/types";

import { useFormHandlers } from "../../hooks/useFormHandlers";

import { STEPS, STEP_FIELDS } from "../../config/const";

interface SellProductFormProps {
  open: boolean;
  onClose: () => void;
}

export default function SellProductForm({ open, onClose }: SellProductFormProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [stepErrors, setStepErrors] = useState<boolean[]>(
    Array(STEPS.length).fill(false)
  );
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(
    Array(STEPS.length).fill(false)
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openResetDialog, setOpenResetDialog] = useState(false);

  /* LOAD SAVED DRAFT */
  const getSavedValues = (): SellProduct => {
    try {
      const saved = localStorage.getItem("sellProductDraft");
      return saved ? JSON.parse(saved) : sellProductDefaultValues;
    } catch {
      return sellProductDefaultValues;
    }
  };

  const methods = useForm<SellProduct>({
    resolver: yupResolver(sellProductSchema),
    mode: "onChange",
    defaultValues: getSavedValues(),
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  /* FETCH CATEGORIES  */
  const { getCategories } = useProduct();

  useEffect(() => {
    // if (!open) return;

    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        setError("Failed to load categories");
      }
    };

    fetchCategories();
  }, [open, getCategories]);

  const canSaveCurrentStep = async () => {
    const fields = STEP_FIELDS[activeStep];
    return await methods.trigger(fields);
  };

  /* FORM HANDLERS */
  const {
    loading,
    handleNext,
    handleBack,
    handleStepClick,
    handleReset,
    handleSave,
    handleSubmitFinal,
  } = useFormHandlers({
    form: methods,
    activeStep,
    setActiveStep,
    stepsLength: STEPS.length,
    stepFields: STEP_FIELDS,
    setStepErrors,
    setCompletedSteps,
  });

  if (!open) return null;

  return (
    <>
      <EcomDialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        backdropBlur={true}
        paperSx={{
          width: "800px",
          height: "720px",
          maxWidth: "95vw",
          maxHeight: "90vh",
          borderRadius: "12px",
        }}
      >
        {/* HEADER */}
        <Box px={2} py={1} borderBottom="1px solid rgba(0,0,0,0.1)">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <DialogTitle sx={{ p: 0, fontWeight: "bold" }}>
              Sell Your Product
            </DialogTitle>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <EcomStepper
            steps={STEPS}
            activeStep={activeStep}
            stepErrors={stepErrors}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
          />
        </Box>

        {/* CONTENT */}
        <DialogContent sx={{ p: 3 }}>
          {error && (
            <Typography color="error" textAlign="center" mb={2}>
              {error}
            </Typography>
          )}

          <FormProvider {...methods}>
            <form
              id="sellProductForm"
              onSubmit={handleSubmit((data) =>
                handleSubmitFinal(data, onClose)
              )}
              noValidate
            >
              {activeStep === 0 && <SellerInfoStep />}
              {activeStep === 1 && <ProductInfoStep categories={categories} />}
              {activeStep === 2 && <PaymentStep />}
            </form>
          </FormProvider>
        </DialogContent>

        {/* ACTIONS */}
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: "1px solid rgba(0,0,0,0.1)",
            bgcolor: "rgba(0,0,0,0.02)",
          }}
        >
          <Box display="flex" alignItems="center" width="100%">
            {/* BACK */}
            <Box flex={1}>
              <EcomButton
                label="Back"
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0}
              />
            </Box>

            {/* ACTIONS */}
            <Box flex={1} display="flex" justifyContent="center" gap={2}>
              {activeStep !== STEPS.length - 1 && (
                <>
                  <EcomButton
                    label="Save"
                    variant="contained"
                    color="success"
                    onClick={async () => {
                      const ok = await canSaveCurrentStep();
                      if (!ok) return;

                      handleSave(methods.getValues());
                      setSnackbarOpen(true);
                    }}
                  />

                  <EcomSnackbar
                    open={snackbarOpen}
                    message="Saved successfully"
                    severity="success"
                    onClose={() => setSnackbarOpen(false)}
                  />
                </>
              )}

              {activeStep === STEPS.length - 1 && (
                <EcomButton
                  label={loading ? "Submitting..." : "Submit"}
                  type="submit"
                  variant="contained"
                  color="success"
                  disabled={!isValid || loading}
                  form="sellProductForm"
                />
              )}

              <EcomButton
                label="Reset"
                variant="outlined"
                onClick={() => setOpenResetDialog(true)}
              />
              <EcomDialog
                open={openResetDialog}
                title="Reset Form?"
                description="All entered data for this step will be cleared."
                confirmText="Reset"
                onClose={() => setOpenResetDialog(false)}
                onConfirm={() => {
                  handleReset();
                  setOpenResetDialog(false);
                }}
              />
            </Box>

            {/* NEXT */}
            <Box flex={1} display="flex" justifyContent="flex-end">
              <EcomButton
                label="Next"
                variant="contained"
                onClick={handleNext}
                disabled={activeStep === STEPS.length - 1}
              />
            </Box>
          </Box>
        </DialogActions>
      </EcomDialog>
    </>
  );
}
