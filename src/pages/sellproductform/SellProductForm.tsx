import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Typography,
  DialogContent,
  DialogActions,
} from "@mui/material";

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
import type { Category, Product, SellProduct } from "../../types/types";

import { useFormHandlers } from "../../hooks/useFormHandlers";

import { STEPS, STEP_FIELDS } from "../../config/const";

interface SellProductFormProps {
  open: boolean;
  onClose: () => void;
  editData?: Product | null;
}

const SellProductForm = ({ open, onClose, editData }: SellProductFormProps) => {
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

  const methods = useForm<SellProduct>({
    resolver: yupResolver(sellProductSchema),
    mode: "onChange",
    defaultValues: editData || sellProductDefaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isValid },
  } = methods;

  // Reset form when editData changes or modal opens
  useEffect(() => {
    if (open) {
      if (editData) {
        reset(editData);
      } else {
        reset(sellProductDefaultValues);
      }

      // Reset UI state to initial values
      setActiveStep(0);
      setStepErrors(Array(STEPS.length).fill(false));
      setCompletedSteps(Array(STEPS.length).fill(false));
    }
  }, [open, editData, reset]);

  /* FETCH CATEGORIES  */
  const { getCategories } = useProduct();

  useEffect(() => {
    if (!open) return;

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
    editData: editData || undefined,
  });

  return (
    <>
      <EcomDialog
        open={open}
        onClose={onClose}
        title={editData ? "Edit Product" : "Sell Your Product"}
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
        <EcomStepper
          steps={STEPS}
          activeStep={activeStep}
          stepErrors={stepErrors}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />
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
                  label={
                    loading
                      ? editData
                        ? "Updating..."
                        : "Submitting..."
                      : editData
                        ? "Update Product"
                        : "Submit"
                  }
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

export default SellProductForm;