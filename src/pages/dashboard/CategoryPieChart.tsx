import React from "react";
import { Box, Typography, Slider } from "@mui/material";
import type { Product } from "../../types/ProductTypes";
import EcomPieChart from "../../components/newcomponents/EcomPieChart";
import { useNavigate } from "react-router-dom";

interface CategoryPieChartProps {
    products: Product[];
}

const CategoryPieChart = ({ products }: CategoryPieChartProps) => {

    const navigate = useNavigate();

    const [topLimit, setTopLimit] = React.useState(5);

    // Count categories
    const categoryCounts: Record<string, number> = {};
    products.forEach((product) => {
        const category = product.category || "Uncategorized";
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    const sortedCategories = Object.entries(categoryCounts)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value);

    const topCategories = sortedCategories.slice(0, topLimit);
    const remainingCategories = sortedCategories.slice(topLimit);

    const othersValue = remainingCategories.reduce(
        (sum, item) => sum + item.value,
        0
    );

    const finalData = [
        ...topCategories,
        ...(othersValue > 0 ? [{ label: "Others", value: othersValue }] : []),
    ];

    const data = finalData.map((item, index) => ({
        id: index,
        value: item.value,
        label: item.label,
        color:
            item.label === "Others"
                ? "#BDBDBD" // grey
                : `hsl(${(index * 360) / finalData.length}, 65%, 55%)`,
    }));

    const handleTopLimitChange = (
        _event: Event,
        newValue: number | number[]
    ) => {
        if (typeof newValue !== "number") return;
        setTopLimit(newValue);
    };

    return (
        <EcomPieChart
            title="Product Distribution by Category"
            data={data}
            headerAction={
                <Box sx={{ width: 200 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Top Categories: {topLimit}
                    </Typography>
                    <Slider
                        value={topLimit}
                        onChange={handleTopLimitChange}
                        valueLabelDisplay="auto"
                        min={1}
                        max={Object.keys(categoryCounts).length || 1}
                    />
                </Box>
            }
            onSliceClick={(item) => {
                if (item.label === "Others") return;
                navigate(`/products?category=${encodeURIComponent(item.label)}`);
            }}
        />
    );
};

export default CategoryPieChart;