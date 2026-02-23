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
        const category = product.category || 'Uncategorized';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    const data = Object.entries(categoryCounts).map(([label, value], index) => ({
        id: index,
        value,
        label,
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
