import type { Product } from '../../types/ProductTypes';
import EcomChartContainer from '../../components/newcomponents/EcomChartContainer';
import { LineChart } from '@mui/x-charts/LineChart';

interface ProductLineChartProps {
    products: Product[];
}

const ProductLineChart = ({ products }: ProductLineChartProps) => {
    const monthlyCounts: Record<string, number> = {};

    products.forEach(product => {
        if (!product.createdAt) return;
        const date = new Date(product.createdAt);
        const month = date.toLocaleString('default', { month: 'short' });

        monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    });

    return (
        <EcomChartContainer title="Top Products by Month" isEmpty={products.length === 0}>
            <LineChart
                xAxis={[{ scaleType: 'point', data: Object.keys(monthlyCounts) }]}
                series={[
                    {
                        data: Object.values(monthlyCounts),
                        label: "Products Added"
                    }
                ]}
                height={300}
            />
        </EcomChartContainer>
    );
};

export default ProductLineChart;
