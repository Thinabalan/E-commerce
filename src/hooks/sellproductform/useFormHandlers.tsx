import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import useProduct from "../useProduct";
import type { CreateProduct, Product, SellProduct } from "../../types/ProductTypes";
import { sellProductDefaultValues } from "../../pages/sellproductform/data/sellProductDefaults";
import { useUI } from "../../context/UIContext";

interface UseFormHandlersProps {
  form: UseFormReturn<SellProduct>;

  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;

  stepsLength: number;
  stepFields: (keyof SellProduct)[][];

  setStepErrors: React.Dispatch<React.SetStateAction<boolean[]>>;
  setCompletedSteps: React.Dispatch<React.SetStateAction<boolean[]>>;
  editData?: Product;
}

export function useFormHandlers({
  form,
  activeStep,
  setActiveStep,
  stepsLength,
  stepFields,
  setStepErrors,
  setCompletedSteps,
  editData,
}: UseFormHandlersProps) {
  const { trigger, resetField } = form;
  const { showSnackbar } = useUI();

  const [loading, setLoading] = useState(false);
  const { addProduct, updateProduct } = useProduct();

  /* VALIDATE CURRENT STEP */
  const validateStep = async () => {
    const isValid = await trigger(stepFields[activeStep]);

    // update error state
    setStepErrors((prev) => {
      const updated = [...prev];
      updated[activeStep] = !isValid;
      return updated;
    });

    // update completed state 
    setCompletedSteps((prev) => {
      const updated = [...prev];
      updated[activeStep] = isValid;
      return updated;
    });

    return isValid;
  };

  /* NEXT  */
  const handleNext = async () => {
    await validateStep();

    if (activeStep < stepsLength - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  /* BACK */
  const handleBack = async () => {
    await validateStep();

    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  /* STEP CLICK */
  const handleStepClick = async (targetStep: number) => {
    if (targetStep === activeStep) return;

    await validateStep();
    setActiveStep(targetStep);
  };

  /* RESET CURRENT STEP */
  const handleReset = () => {
    stepFields[activeStep].forEach((field) => {
      const defaultValue = editData ? editData[field] : sellProductDefaultValues[field];
      resetField(field, {
        defaultValue,
        keepDirty: false,
        keepTouched: false,
      });
    });

    // clear error + completed state for this step
    setStepErrors((prev) => {
      const updated = [...prev];
      updated[activeStep] = false;
      return updated;
    });

    setCompletedSteps((prev) => {
      const updated = [...prev];
      updated[activeStep] = false;
      return updated;
    });
  };

  /* SAVE DRAFT */
  const handleSave = async (data: SellProduct) => {
    try {
      const now = new Date().toISOString();
      const draftData: CreateProduct = {
        ...data,
        status: "draft",
        rating: 0,
        updatedAt: now,
        image: data.image || ""
      };

      if (editData?.id) {
        await updateProduct(editData.id, draftData);
      } else {
        await addProduct(draftData);
      }
      console.log("Draft saved:", draftData);
    } catch (error) {
      console.error("Failed to save draft", error);
    }
  };

  /* FINAL SUBMIT */
  const handleSubmitFinal = async (
    data: SellProduct,
    onClose: () => void
  ) => {
    setLoading(true);

    try {
      const now = new Date().toISOString();

      if (editData?.id) {
        const updateData: Partial<Product> = { ...data, updatedAt: now, status: "active" as const };
        if (!editData.createdAt) {
          updateData.createdAt = now;
        }
        await updateProduct(editData.id, updateData);
        showSnackbar("Product updated successfully!", "success");
      } else {
        const newData: CreateProduct = {
          ...data,
          status: "active" as const,
          rating: 0,
          createdAt: now,
          updatedAt: now,
          image: data.image || "",
        };
        await addProduct(newData);
        showSnackbar("Product submitted successfully!", "success");
      }
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
      showSnackbar("Failed to submit product. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleNext,
    handleBack,
    handleStepClick,
    handleReset,
    handleSave,
    handleSubmitFinal,
  };
}


