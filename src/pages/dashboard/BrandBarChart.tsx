import { BarChart } from '@mui/x-charts/BarChart';
import type { Product } from '../../types/ProductTypes';
import EcomChartContainer from '../../components/newcomponents/EcomChartContainer';

interface BrandBarChartProps {
    products: Product[];
}

const BrandBarChart = ({ products }: BrandBarChartProps) => {
    // 1. Find all unique brands
    const brands = Array.from(new Set(products.map(p => p.brand || "Unknown")));

    // 2. Define statuses and colors
    const statuses = [
        { label: 'Active', value: 'active', color: '#2e9433' },
        { label: 'Inactive', value: 'inactive', color: '#c62828' },
        { label: 'Draft', value: 'draft', color: '#ef6c00' }
    ];

    // 3. Prepare series data
    const series = statuses.map(status => ({
        label: status.label,
        data: brands.map(brand =>
            products.filter(p => (p.brand || "Unknown") === brand && p.status === status.value).length
        ),
        stack: 'brandStatus', // Shared ID enables stacking
        color: status.color
    }));

    return (
        <EcomChartContainer title="Brand Inventory by Status" isEmpty={products.length === 0}>
            <BarChart
                xAxis={[{ scaleType: 'band', data: brands, label: "Brands" }]}
                yAxis={[{ label: "Product Count" }]}
                series={series}
                height={300}
                borderRadius={2}
            />
        </EcomChartContainer>
    );
};

export default BrandBarChart;
