import { Grid } from "@mui/material";
import { useFormContext } from "react-hook-form";
import EcomTextField from "../../components/newcomponents/EcomTextField";
import EcomDropdown from "../../components/newcomponents/EcomDropdown";
import type { SellProduct } from "../../types/ProductTypes";

const PaymentStep = () => {
  const { watch } = useFormContext<SellProduct>();
  const paymentMethod = watch("paymentMethod");

  return (
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
            <EcomTextField
              name="accountName"
              label="Account Holder Name"
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <EcomTextField
              name="accountNumber"
              label="Account Number"
              required
            />
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
        <EcomTextField
          name="paymentNotes"
          label="Payment Notes"
          multiline
          rows={2}
        />
      </Grid>
    </Grid>
  );
};

export default PaymentStep;
