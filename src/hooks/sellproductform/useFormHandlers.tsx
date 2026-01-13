import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import useProduct from "../useProduct";
import type { Product, SellProduct, DraftProduct } from "../../types/types";
import { sellProductDefaultValues } from "../../pages/sellproductform/data/sellProductDefaults";

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

  const [loading, setLoading] = useState(false);
  const { addProduct, updateProduct, saveDraft, deleteDraft } = useProduct();

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
  const handleSave = async (data: SellProduct) => {
    try {
      const draftData: DraftProduct = {
        ...data,
        id: editData?.id,
        status: "draft",
        rating: 0,
        image: data.image || ""
      };
      await saveDraft(draftData);
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

      if (editData?.id && editData?.status !== "draft") {
        const updateData = { ...data, updatedAt: now };
        await updateProduct(editData.id, updateData);
        alert("Product updated successfully!");
      } else {
        const newData = {
          ...data,
          rating: 0,
          createdAt: now,
          updatedAt: now,
        };
        await addProduct(newData);
        alert("Product submitted successfully!");
      }

      if (editData?.status === "draft" && editData?.id) {
        await deleteDraft(editData.id);
      }
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
