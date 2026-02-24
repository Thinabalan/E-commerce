import { PieChart } from '@mui/x-charts/PieChart';
import type { Product } from '../../types/ProductTypes';
import EcomChartContainer from '../../components/newcomponents/EcomChartContainer';

interface CategoryPieChartProps {
    products: Product[];
}

const CategoryPieChart = ({ products }: CategoryPieChartProps) => {
    // Process data for the pie chart
    const categoryCounts: Record<string, number> = {};
    products.forEach(product => {
        const category = product.category || "Uncategorized";
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    const sortedCategories = Object.entries(categoryCounts)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value);

    const TOP_LIMIT = 5;

    const topCategories = sortedCategories.slice(0, TOP_LIMIT);
    const remainingCategories = sortedCategories.slice(TOP_LIMIT);

    const othersValue = remainingCategories.reduce(
        (sum, item) => sum + item.value,
        0
    );

    const finalData = [
        ...topCategories,
        ...(othersValue > 0 ? [{ label: "Others", value: othersValue }] : [])
    ];

    const COLORS = [
        "#4CAF50", // green
        "#2196F3", // blue
        "#FF9800", // orange
        "#9C27B0", // purple
        "#00BCD4", // cyan
    ];

    const data = finalData.map((item, index) => ({
        id: index,
        value: item.value,
        label: item.label,
        color:
            item.label === "Others"
                ? "#BDBDBD" // grey 
                : COLORS[index % COLORS.length],
    }));

    return (
        <EcomChartContainer title="Product Distribution by Category" isEmpty={products.length === 0}>
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
