import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  Grid,
} from "@mui/material";

import useProduct from "../hooks/useProduct";
import type { Category, SellProductFormInputs } from "../types/types";
import { ERROR_MESSAGES } from "../constants/appConstants";
import EcomTextField from "../components/newcomponents/EcomTextField";
import EcomDropdown from "../components/newcomponents/EcomDropdown";
import EcomButton from "../components/newcomponents/EcomButton";
import { sellProductSchema } from "../schema/schema";
import "./SellProductForm.css";

interface SellProductFormProps {
  open: boolean;
  onClose: () => void;
}

const STEPS = ["Seller Info", "Product Info", "Payment"];

export default function SellProductForm({ open, onClose }: SellProductFormProps) {
  const [activeStep, setActiveStep] = useState(0);

  const methods = useForm<SellProductFormInputs>({
    resolver: yupResolver(sellProductSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      sellerType: "",
      companyName: "",
      companyEmail: "",
      companyPhone: "",
      city: "",
      address: "",

      productName: "",
      brand: "",
      price: 0,
      stock: 0,
      category: "",
      warranty: "",
      image: "",
      description: "",
      highlights: "",
      returnPolicy: "",

      paymentMethod: "",
      upiId: "",
      accountName: "",
      accountNumber: "",
      ifsc: "",
      bankName: "",
      paymentNotes: "",
    },
  });

  const { handleSubmit, watch, trigger } = methods;

  const sellerType = watch("sellerType");
  const paymentMethod = watch("paymentMethod");

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
  const stepFields: (keyof SellProductFormInputs)[][] = [
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
      "returnPolicy",
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

  stepFields[activeStep].forEach((field) => {
    methods.resetField(field);
  });

  setError(null);
};

  /* SUBMIT */
  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(ERROR_MESSAGES.successMsg);
      onClose();
    }, 1000);
  };

  /* NAVIGATION */
  const handleNext = async () => {
    let fieldsToValidate: (keyof SellProductFormInputs)[] = [];

    if (activeStep === 0) {
      fieldsToValidate = ["name", "email", "phone", "sellerType"];
      if (sellerType === "business") {
        fieldsToValidate.push("companyName", "companyEmail", "companyPhone");
      }
    } else if (activeStep === 1) {
      fieldsToValidate = ["productName", "brand", "price", "stock", "category", "description"];
    }

    const isValid = await trigger(fieldsToValidate as any);
    if (isValid && activeStep < STEPS.length - 1) {
      setActiveStep((prev: number) => prev + 1);
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
            <button className="sell-form-close" onClick={onClose}>
              &times;
            </button>
          </Box>

          <Stepper activeStep={activeStep} alternativeLabel>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
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
              {activeStep === 0 && (
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <EcomTextField name="name" label="Seller Name" required />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <EcomTextField name="email" label="Email" type="email" required />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <EcomDropdown
                      name="sellerType"
                      label="Seller Type"
                      required
                      options={[
                        { value: "individual", label: "Individual" },
                        { value: "business", label: "Business" },
                      ]}
                    />
                  </Grid>

                  {sellerType === "business" && (
                    <>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <EcomTextField name="companyName" label="Company Name" required />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <EcomTextField name="companyEmail" label="Company Email" type="email" required />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <EcomTextField name="companyPhone" label="Company Phone" required />
                      </Grid>
                    </>
                  )}

                  <Grid size={{ xs: 12, md: 6 }}>
                    <EcomTextField name="phone" label="Phone" required />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <EcomTextField name="city" label="City" />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <EcomTextField name="address" label="Address" multiline rows={2} />
                  </Grid>
                </Grid>
              )}

              {/* PRODUCT INFO */}
              {activeStep === 1 && (
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <EcomTextField name="productName" label="Product Name" required />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <EcomTextField name="brand" label="Brand" required />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <EcomTextField name="price" label="Price" type="number" required />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <EcomTextField name="stock" label="Stock Quantity" type="number" required />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <EcomDropdown
                      name="category"
                      label="Category"
                      required
                      options={categories.map((c: Category) => ({ value: c.name, label: c.name }))}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <EcomDropdown
                      name="warranty"
                      label="Warranty"
                      options={[
                        { value: "yes", label: "Yes" },
                        { value: "no", label: "No" },
                      ]}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <EcomTextField name="image" label="Image URL" />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <EcomTextField name="description" label="Description" required multiline rows={3} />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <EcomTextField name="highlights" label="Highlights" multiline rows={2} />
                  </Grid>
                </Grid>
              )}

              {/* PAYMENT INFO */}
              {activeStep === 2 && (
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <EcomDropdown
                      name="paymentMethod"
                      label="Payment Method"
                      required
                      options={[
                        { value: "cod", label: "Cash on Delivery" },
                        { value: "upi", label: "UPI" },
                        { value: "bank", label: "Bank Transfer" },
                      ]}
                    />
                  </Grid>

                  {paymentMethod === "upi" && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <EcomTextField name="upiId" label="UPI ID" required />
                    </Grid>
                  )}

                  {paymentMethod === "bank" && (
                    <>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <EcomTextField name="accountName" label="Account Holder Name" required />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <EcomTextField name="accountNumber" label="Account Number" required />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <EcomTextField name="ifsc" label="IFSC Code" required />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <EcomTextField name="bankName" label="Bank Name" required />
                      </Grid>
                    </>
                  )}

                  <Grid size={{ xs: 12 }}>
                    <EcomTextField name="paymentNotes" label="Payment Notes" multiline rows={2} />
                  </Grid>
                </Grid>
              )}
            </form>
          </FormProvider>
        </div>

        {/* FOOTER */}
        <div className="sell-form-footer">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              {activeStep !== 0 && (
                <EcomButton
                  label="Back"
                  variant="outlined"
                  color="secondary"
                  onClick={handleBack}
                  sx={{ mr: 2 }}
                />
              )}

              <EcomButton
                label="Reset"
                variant="outlined"
                color="inherit"
                onClick={handleStepReset}
              />
            </Box>

            <Box display="flex" gap={2}>
              {activeStep !== STEPS.length - 1 && (
                <EcomButton
                  label="Next"
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                />
              )}

              <EcomButton
                label={loading ? "Saving..." : "Save"}
                variant="contained"
                color="primary"
                type="submit"
                form="sellProductForm"
                disabled={loading}
              />
            </Box>
          </Box>
        </div>
      </div>
    </>
  );
}
