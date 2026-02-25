import type { Product } from '../../types/ProductTypes';
import EcomChartContainer from '../../components/newcomponents/EcomChartContainer';
import { LineChart } from '@mui/x-charts/LineChart';
import { FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import { useMemo, useState } from 'react';

interface ProductLineChartProps {
    products: Product[];
}

const ProductLineChart = ({ products }: ProductLineChartProps) => {
    const [selectedYear, setSelectedYear] = useState<number | "all">("all");

    // Get unique years
    const years = useMemo(() => {
        const uniqueYears = new Set<number>();

        products.forEach(product => {
            if (!product.createdAt) return;
            const date = new Date(product.createdAt);
            if (!isNaN(date.getTime())) {
                uniqueYears.add(date.getFullYear());
            }
        });

        return Array.from(uniqueYears).sort((a, b) => b - a);
    }, [products]);

    // Get unique categories
    const TOP_LIMIT = 3;

    const categories = useMemo(() => {
        const categoryTotals: Record<string, number> = {};

        products.forEach(p => {
            const category = p.category || "Uncategorized";
            categoryTotals[category] = (categoryTotals[category] || 0) + 1;
        });

        const sorted = Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1])
            .map(([category]) => category);

        const topCategories = sorted.slice(0, TOP_LIMIT);
        const remainingCategories = sorted.slice(TOP_LIMIT);

        return {
            topCategories,
            remainingCategories,
        };
    }, [products]);

    // Build monthly category counts
    const { months, series } = useMemo(() => {
        const monthlyCategoryCounts: Record<string, Record<string, number>> = {};

        products.forEach(product => {
            if (!product.createdAt) return;

            const date = new Date(product.createdAt);
            if (isNaN(date.getTime())) return;

            const year = date.getFullYear();
            if (selectedYear !== "all" && year !== selectedYear) return;

            const month = date.getMonth();
            const key = `${year}-${String(month + 1).padStart(2, "0")}`;

            if (!monthlyCategoryCounts[key]) {
                monthlyCategoryCounts[key] = {};
            }

            const category = product.category || "Uncategorized";

            // If category not in top list → treat as Others
            const finalCategory = categories.topCategories.includes(category)
                ? category
                : "Others";

            if (!monthlyCategoryCounts[key][finalCategory]) {
                monthlyCategoryCounts[key][finalCategory] = 0;
            }

            monthlyCategoryCounts[key][finalCategory]++;
        });

        const sortedEntries = Object.entries(monthlyCategoryCounts).sort(
            ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
        );

        const months = sortedEntries.map(([key]) => {
            const date = new Date(key);
            return date.toLocaleString("default", {
                month: "short",
                year: "numeric",
            });
        });

        const finalCategories = [
            ...categories.topCategories,
            ...(categories.remainingCategories.length > 0 ? ["Others"] : []),
        ];

        const series = finalCategories.map((category, index) => ({
            label: category,
            data: sortedEntries.map(
                ([, monthData]) => monthData[category] || 0
            ),
            showMark: true,
            color:
                category === "Others"
                    ? "#9E9E9E"
                    : `hsl(${(index * 360) / finalCategories.length}, 65%, 55%)`,
        }));

        return { months, series };
    }, [products, selectedYear, categories]);

    return (
        <EcomChartContainer
            title="Products Added by Month (Category-wise)"
            isEmpty={products.length === 0}
            headerAction={
                <FormControl size="small" sx={{ width: 100 }}>
                    <InputLabel>Year</InputLabel>
                    <Select
                        value={selectedYear}
                        label="Year"
                        onChange={(e) =>
                            setSelectedYear(
                                e.target.value === "all" ? "all" : Number(e.target.value)
                            )
                        }
                    >
                        <MenuItem value="all">All</MenuItem>
                        {years.map((year) => (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            }
        >
            <LineChart
                xAxis={[
                    {
                        scaleType: "point",
                        data: months,
                        label: "Month",
                    },
                ]}
                yAxis={[{ label: "Product Count" }]}
                series={series}
                height={300}
            />
        </EcomChartContainer>
    );
};

export default ProductLineChart;