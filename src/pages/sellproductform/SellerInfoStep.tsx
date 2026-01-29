import { Grid } from "@mui/material";
import { useFormContext } from "react-hook-form";
import EcomTextField from "../../components/newcomponents/EcomTextField";
import EcomDropdown from "../../components/newcomponents/EcomDropdown";
import type { SellProduct } from "../../types/ProductTypes";

const SellerInfoStep = () => {
  const { watch } = useFormContext<SellProduct>();
  const sellerType = watch("sellerType");

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <EcomTextField
          name="sellerName"
          label="Seller Name"
          required
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <EcomTextField
          name="email"
          label="Email"
          type="email"
          required
        />
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
            <EcomTextField
              name="companyName"
              label="Company Name"
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <EcomTextField
              name="companyEmail"
              label="Company Email"
              type="email"
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <EcomTextField
              name="companyPhone"
              label="Company Phone"
              required
            />
          </Grid>
        </>
      )}

      <Grid size={{ xs: 12, md: 6 }}>
        <EcomTextField
          name="phone"
          label="Phone"
          required
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <EcomTextField
          name="city"
          label="City"
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <EcomTextField
          name="address"
          label="Address"
          multiline
          rows={2}
        />
      </Grid>
    </Grid>
  );
};

export default SellerInfoStep;
