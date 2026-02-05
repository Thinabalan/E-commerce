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
import EcomDialog from "../../components/newcomponents/EcomDialog";

import SellerInfoStep from "./SellerInfoStep";
import ProductInfoStep from "./ProductInfoStep";
import PaymentStep from "./PaymentStep";

import { sellProductSchema } from "../../schema/sellProductSchema";
import { sellProductDefaultValues } from "./data/sellProductDefaults";
import type { Category, Product, SellProduct } from "../../types/ProductTypes";

import { useFormHandlers } from "../../hooks/sellproductform/useFormHandlers";
import { useUI } from "../../context/UIContext";

import { STEPS, STEP_FIELDS } from "../../constants/sellProductConstants";

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
  // const [openDiscardDialog, setOpenDiscardDialog] = useState(false);
  const { showSnackbar, showDialog } = useUI();

  const productform = useForm<SellProduct>({
    resolver: yupResolver(sellProductSchema),
    mode: "onChange",
    defaultValues: editData || sellProductDefaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isValid },
  } = productform;

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
    return await productform.trigger(fields);
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
    form: productform,
    activeStep,
    setActiveStep,
    stepsLength: STEPS.length,
    stepFields: STEP_FIELDS,
    setStepErrors,
    setCompletedSteps,
    editData: editData || undefined,
  });

  // const handleCloseRequest = () => {
  //   // If user has made any progress (not at step 0 or editData is present)
  //   if (activeStep > 0 || editData) {
  //     setOpenDiscardDialog(true);
  //   } else {
  //     onClose();
  //   }
  // };

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

          <FormProvider {...productform}>
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

                      handleSave(productform.getValues());
                      showSnackbar("Saved successfully", "success");
                    }}
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
                onClick={() => showDialog({
                  title: "Reset Form?",
                  description: "All entered data for this step will be cleared.",
                  confirmText: "Reset",
                  onConfirm: () => {
                    handleReset();
                  }
                })}
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

      {/* <EcomDialog
        open={openDiscardDialog}
        title="Discard Changes?"
        description="Are you sure you want to close this form? All unsaved progress will be lost."
        confirmText="Discard"
        onClose={() => setOpenDiscardDialog(false)}
        onConfirm={() => {
          setOpenDiscardDialog(false);
          onClose();
        }}
      /> */}
    </>
  );
}

export default SellProductForm;