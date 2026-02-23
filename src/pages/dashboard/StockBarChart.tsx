import { BarChart } from '@mui/x-charts/BarChart';
import type { Product } from '../../types/ProductTypes';
import EcomChartContainer from '../../components/newcomponents/EcomChartContainer';

interface StockBarChartProps {
    products: Product[];
}

const StockBarChart = ({ products }: StockBarChartProps) => {
    // Sort products by stock and take top 6 for better visualization
    const topProducts = [...products]
        .sort((a, b) => (b.stock || 0) - (a.stock || 0))
        .slice(0, 6);

    const xLabels = topProducts.map(p => p.productName);
    const stockData = topProducts.map(p => p.stock || 0);

    return (
        <EcomChartContainer title="Top Products by Stock Level" isEmpty={products.length === 0}>
            <BarChart
                xAxis={[{ scaleType: 'band', data: xLabels }]}
                series={[{ data: stockData, label: 'Stock Quantity', color: '#3f51b5' }]}
                height={300}
                margin={{ top: 20, bottom: 50, left: 40, right: 10 }}
                borderRadius={8}
            />
        </EcomChartContainer>
    );
};

export default StockBarChart;
