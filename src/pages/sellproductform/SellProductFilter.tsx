import { Grid, Box } from "@mui/material";
import { FormProvider, type UseFormReturn } from "react-hook-form";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import EcomButton from "../../components/newcomponents/EcomButton";
import EcomTextField from "../../components/newcomponents/EcomTextField";
import EcomDropdown from "../../components/newcomponents/EcomDropdown";
import { CREATED_AT_RANGE } from "../../constants/sellProductConstants";
import type { ProductFilters } from "../../types/types";
// export interface ProductFilters {
//     productName: string;
//     sellerName: string;
//     email: string;
//     category: string;
//     brand: string;
//     createdAtRange: string;
// }

interface SellProductFilterProps {
    methods: UseFormReturn<ProductFilters>;
    categories: (string | undefined)[];
    brandsByCategory: (category: string) => (string | undefined)[];
    onSearch: () => void;
    onReset: () => void;
}

const SellProductFilter = ({
    methods,
    categories,
    brandsByCategory,
    onSearch,
    onReset,
}: SellProductFilterProps) => {
    const { watch } = methods;
    const selectedCategory = watch("category");

    return (
        <Box mb={3} p={2} borderRadius={2} bgcolor="background.paper" boxShadow={2}>
            <FormProvider {...methods}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <EcomTextField name="productName" label="Product Name" />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <EcomTextField name="sellerName" label="Seller Name" />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <EcomTextField name="email" label="Email" />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <EcomDropdown
                            name="category"
                            label="Category"
                            displayEmpty
                            options={[
                                { value: "", label: "All" },
                                ...categories.map((c) => ({ value: c || "", label: c || "—" })),
                            ]}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <EcomDropdown
                            name="brand"
                            label="Brand"
                            displayEmpty
                            disabled={!selectedCategory}
                            options={[
                                { value: "", label: "All" },
                                ...(selectedCategory
                                    ? brandsByCategory(selectedCategory).map((b) => ({
                                        value: b || "",
                                        label: b || "—",
                                    }))
                                    : []),
                            ]}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <EcomDropdown
                            name="createdAtRange"
                            label="Created At"
                            displayEmpty
                            options={CREATED_AT_RANGE}
                        />
                    </Grid>
                </Grid>
            </FormProvider>

            <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                <EcomButton
                    variant="outlined"
                    label="Reset"
                    startIcon={<RestartAltIcon />}
                    onClick={onReset}
                />
                <EcomButton
                    variant="contained"
                    label="Search"
                    startIcon={<SearchIcon />}
                    onClick={onSearch}
                />
            </Box>
        </Box>
    );
};

export default SellProductFilter;
