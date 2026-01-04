import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import useProduct from "../../hooks/useProduct";
import type { Category, SellProduct } from "../../types/types";

import EcomButton from "../../components/newcomponents/EcomButton";
import EcomStepper from "../../components/newcomponents/EcomStepper";
import SellerInfoStep from "./SellerInfoStep";
import ProductInfoStep from "./ProductInfoStep";
import PaymentStep from "./PaymentStep";

import { sellProductSchema } from "../../schema/sellProductSchema";
import { sellProductDefaultValues } from "../../default/sellProductDefaults";

import { useFormHandlers } from "../../hooks/useFormHandlers";
import EcomSnackbar from "../../components/newcomponents/EcomSnackbar";
import EcomDialog from "../../components/newcomponents/EcomDialog";

import "./SellProductForm.css";

interface SellProductFormProps {
  open: boolean;
  onClose: () => void;
}

const STEPS = ["Seller Info", "Product Info", "Payment"];

const STEP_FIELDS: (keyof SellProduct)[][] = [
  [
    "name",
    "email",
    "phone",
    "sellerType",
    "companyName",
    "companyEmail",
    "companyPhone",
    "city",
    "address",
  ],
  [
    "productName",
    "brand",
    "price",
    "stock",
    "category",
    "warranty",
    "image",
    "description",
    "highlights",
  ],
  [
    "paymentMethod",
    "upiId",
    "accountName",
    "accountNumber",
    "ifsc",
    "bankName",
    "paymentNotes",
  ],
];

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
      <div className="sell-form-backdrop" onClick={onClose} />
      <div className="sell-form-modal">
        {/* HEADER */}
        <div className="sell-form-header">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" fontWeight="bold">
              Sell Your Product
            </Typography>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Box>

          <EcomStepper
            steps={STEPS}
            activeStep={activeStep}
            stepErrors={stepErrors}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
          />
        </div>

        {/* BODY */}
        <div className="sell-form-body">
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
              {activeStep === 1 && (
                <ProductInfoStep categories={categories} />
              )}
              {activeStep === 2 && <PaymentStep />}
            </form>
          </FormProvider>
        </div>

        {/* FOOTER */}
        <div className="sell-form-footer">
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
                    onClick={() => {
                      handleSave(methods.getValues());
                      setSnackbarOpen(true);
                    }}
                  />
                  {/* SNACKBAR */}
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
              {/* RESET DIALOG  */}
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
        </div>
      </div>
    </>
  );
}
