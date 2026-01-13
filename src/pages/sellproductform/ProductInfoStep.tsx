import { Grid } from "@mui/material";
import EcomTextField from "../../components/newcomponents/EcomTextField";
import EcomDropdown from "../../components/newcomponents/EcomDropdown";
import type { Category } from "../../types/types";
import EcomRadioGroup from "../../components/newcomponents/EcomRadioGroup";
import EcomCheckbox from "../../components/newcomponents/EcomCheckbox";
import { PRODUCT_FEATURES } from "../../constants/sellProductConstants";

interface ProductInfoStepProps {
  categories: Category[];
}

const ProductInfoStep = ({ categories }: ProductInfoStepProps) => {
  return (
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
        <EcomTextField
          name="stock"
          label="Stock Quantity"
          type="number"
          required
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <EcomDropdown
          name="category"
          label="Category"
          required
          options={categories.map((c) => ({
            value: c.name,
            label: c.name,
          }))}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <EcomRadioGroup
          name="condition"
          label="Product Condition"
          options={[
            { label: "New", value: "new" },
            { label: "Used", value: "used" },
          ]}
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
        <EcomCheckbox
          name="productFeatures"
          label="Product Features"
          options={ PRODUCT_FEATURES }
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <EcomTextField
          name="description"
          label="Description"
          required
          multiline
          rows={3}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <EcomTextField
          name="highlights"
          label="Highlights"
          multiline
          rows={2}
        />
      </Grid>
    </Grid>

  );
};

export default ProductInfoStep;
