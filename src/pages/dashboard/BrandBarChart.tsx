import { BarChart } from '@mui/x-charts/BarChart';
import type { Product } from '../../types/ProductTypes';
import EcomChartContainer from '../../components/newcomponents/EcomChartContainer';

interface BrandBarChartProps {
    products: Product[];
}

const BrandBarChart = ({ products }: BrandBarChartProps) => {
    const brandCounts: Record<string, number> = {};

    products.forEach(product => {
        const brand = product.brand || "Unknown";
        brandCounts[brand] = (brandCounts[brand] || 0) + 1;
    });

    const labels = Object.keys(brandCounts);
    const values = Object.values(brandCounts);

    return (
        <EcomChartContainer title="Top Products by brands" isEmpty={products.length === 0}>
            <BarChart
                xAxis={[{ scaleType: 'band', data: labels }]}
                series={[{ data: values, label: 'Products per Brand' }]}
                height={300}
            />
        </EcomChartContainer>
    );
};

export default BrandBarChart;
