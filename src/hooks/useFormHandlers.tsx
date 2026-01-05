import { useState } from "react";
import type { SellProduct } from "../types/types";
import { sellProductDefaultValues } from "../default/sellProductDefaults";
import type { UseFormReturn } from "react-hook-form";
import useProduct from "./useProduct";

interface UseFormHandlersProps {
  form: UseFormReturn<SellProduct>;

  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;

  stepsLength: number;
  stepFields: (keyof SellProduct)[][];

  setStepErrors: React.Dispatch<React.SetStateAction<boolean[]>>;
  setCompletedSteps: React.Dispatch<React.SetStateAction<boolean[]>>;
}

export function useFormHandlers({
  form,
  activeStep,
  setActiveStep,
  stepsLength,
  stepFields,
  setStepErrors,
  setCompletedSteps,
}: UseFormHandlersProps) {
  const { trigger, resetField } = form;

  const [loading, setLoading] = useState(false);
  const { addProduct } = useProduct();

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
      resetField(field, {
        defaultValue: sellProductDefaultValues[field],
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
  const handleSave = (data: SellProduct) => {
    try {
      localStorage.setItem("sellProductDraft", JSON.stringify(data));
      console.log("Draft saved:", data);
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
      console.log("Submitting data:", data);
      await addProduct(data);

      localStorage.removeItem("sellProductDraft");
      alert("Product submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit product. Please try again.");
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
