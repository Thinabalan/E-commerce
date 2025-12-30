import React from "react";
import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Typography,
} from "@mui/material";

import useProduct from "../../hooks/useProduct";
import type { Category, SellProduct } from "../../types/types";

import EcomButton from "../../components/newcomponents/EcomButton";
import EcomStepper from "../../components/newcomponents/EcomStepper";
import SellerInfoStep from "./SellerInfoStep";
import ProductInfoStep from "./ProductInfoStep";
import PaymentStep from "./PaymentStep";

import { sellProductSchema } from "../../schema/sellProductSchema";
import { sellProductDefaultValues } from "../../default/sellProductDefaults";

import "./SellProductForm.css";
import IconButton from '@mui/material/IconButton';
import CloseIcon from "@mui/icons-material/Close";

interface SellProductFormProps {
  open: boolean;
  onClose: () => void;
}

const STEPS = ["Seller Info", "Product Info", "Payment"];

const STEP_FIELDS: (keyof SellProduct)[][] = [
  // Step 1 – Seller
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

  // Step 2 – Product
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

  // Step 3 – Payment
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
  const [stepErrors, setStepErrors] = React.useState<boolean[]>(
    Array(STEPS.length).fill(false)
  );

  const methods = useForm<SellProduct>({
    resolver: yupResolver(sellProductSchema),
    mode: "onChange",
    defaultValues: sellProductDefaultValues,
  });

  const { handleSubmit, trigger, resetField, formState:{isValid}  } = methods;

  /* CUSTOM HOOK */
  const { getCategories } = useProduct();

  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* FETCH CATEGORIES */
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

  /* RESET CURRENT STEP */
  const handleStepReset = () => {
    STEP_FIELDS[activeStep].forEach((field) => {
      resetField(field);
    });
    setError(null);
  };

  /* SUBMIT */
  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Product submitted successfully!");
      onClose();
    }, 1000);
  };

  /* NAVIGATION */
  const handleNext = async () => {
    // Validate current step fields
    const isStepValid = await trigger(STEP_FIELDS[activeStep]);

    // Update error state for visual feedback
    setStepErrors((prev) => {
      const updated = [...prev];
      updated[activeStep] = !isStepValid;
      return updated;
    });

    // ALWAYS move to next step
    if (activeStep < STEPS.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev: number) => prev - 1);
    }
  };

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
            <IconButton aria-label="close" size="small" onClick={onClose}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Box>

          <EcomStepper
            steps={STEPS}
            activeStep={activeStep}
            stepErrors={stepErrors}
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
            <form id="sellProductForm" onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* SELLER INFO */}
              {activeStep === 0 && <SellerInfoStep />}

              {/* PRODUCT INFO */}
              {activeStep === 1 && (<ProductInfoStep categories={categories} />)}

              {/* PAYMENT INFO */}
              {activeStep === 2 && <PaymentStep />}
            </form>
          </FormProvider>
        </div>

        {/* FOOTER */}
        <div className="sell-form-footer">
          <Box display="flex" alignItems="center" width="100%">

            {/* BACK */}
            <Box flex={1} display="flex" justifyContent="flex-start">
              <EcomButton
                label="Back"
                variant="outlined"
                color="secondary"
                onClick={handleBack}
                disabled={activeStep === 0}
              />
            </Box>

            {/* SAVE / SUBMIT */}
            <Box flex={1} display="flex" justifyContent="center" gap={2}>
              {activeStep === STEPS.length - 1 ? (
                <EcomButton
                  label={loading ? "Submitting..." : "Submit"}
                  variant="contained"
                  color="success"
                  type="submit"
                  form="sellProductForm"
                  disabled={!isValid || loading}
                />
              ) : (
                <EcomButton
                  label="Save"
                  variant="contained"
                  color="success"
                  type="submit"
                />
              )}

              <EcomButton
                label="Reset"
                variant="outlined"
                color="inherit"
                onClick={handleStepReset}
              />
            </Box>

            {/* NEXT */}
            <Box flex={1} display="flex" justifyContent="flex-end">
              <EcomButton
                label="Next"
                variant="contained"
                color="primary"
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
