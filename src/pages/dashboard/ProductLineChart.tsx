import type { Product } from '../../types/ProductTypes';
import EcomChartContainer from '../../components/newcomponents/EcomChartContainer';
import { LineChart } from '@mui/x-charts/LineChart';
import { FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import { useMemo, useState } from 'react';

interface ProductLineChartProps {
    products: Product[];
}

const ProductLineChart = ({ products }: ProductLineChartProps) => {
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
    const [selectedYear, setSelectedYear] = useState<number | "all">("all");
    const monthlyCounts: Record<string, number> = {};

    products.forEach(product => {
        if (!product.createdAt) return;
        const date = new Date(product.createdAt);
        if (isNaN(date.getTime())) return;
        const year = date.getFullYear();

        // Filter
        if (selectedYear !== "all" && year !== selectedYear) return;
        const month = date.getMonth();
        const key = `${year}-${String(month + 1).padStart(2, "0")}`;
        monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;
    });

    // Convert + sort once
    const sortedEntries = Object.entries(monthlyCounts).sort(
        ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
    );

    // Prepare arrays directly
    const months = sortedEntries.map(([key]) => {
        const date = new Date(key);
        return date.toLocaleString("default", {
            month: "short",
            year: "numeric",
        });
    });

    const values = sortedEntries.map(([, value]) => value);
    return (
        <EcomChartContainer title="Products Added by Month" isEmpty={products.length === 0}
            headerAction={
                <FormControl size="small" sx={{ width: 100, mb: 2 }}>
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
                xAxis={[{
                    scaleType: "point",
                    data: months,
                    label: "Month",
                }]}
                yAxis={[{ label: "Product Count" }]}
                series={[
                    {
                        data: values,
                        label: "Products Added",
                    }
                ]}
                height={300}
            />
        </EcomChartContainer>
    );
};

export default ProductLineChart;
