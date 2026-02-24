import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Typography, Slider } from "@mui/material";
import type { Product } from "../../types/ProductTypes";
import EcomChartContainer from "../../components/newcomponents/EcomChartContainer";

interface CategoryPieChartProps {
    products: Product[];
}

const CategoryPieChart = ({ products }: CategoryPieChartProps) => {
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

    // const COLORS = [
    //     "#4CAF50",
    //     "#2196F3",
    //     "#FF9800",
    //     "#9C27B0",
    //     "#00BCD4",
    // ];

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
        <EcomChartContainer
            title="Product Distribution by Category"
            isEmpty={products.length === 0}
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
                        max={Object.keys(categoryCounts).length}
                    />
                </Box>
            }
        >
            <PieChart
                series={[
                    {
                        data,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                        innerRadius: 30,
                        paddingAngle: 5,
                        cornerRadius: 5,
                    },
                ]}
                height={300}
            />
        </EcomChartContainer>
    );
};

export default CategoryPieChart;