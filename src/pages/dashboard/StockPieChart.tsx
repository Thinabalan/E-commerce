import { PieChart } from '@mui/x-charts/PieChart';
import type { Product } from '../../types/ProductTypes';
import EcomChartContainer from '../../components/newcomponents/EcomChartContainer';

interface StockStatusChartProps {
    products: Product[];
}

const StockStatusChart = ({ products }: StockStatusChartProps) => {
    const inStock = products.filter(p => Number(p.stock ?? 0) > 10).length;
    const lowStock = products.filter(p => Number(p.stock ?? 0) > 0 && (p.stock ?? 0) <= 10).length;
    const outOfStock = products.filter(p => Number(p.stock ?? 0) === 0).length;

    const data = [
        { id: 0, value: inStock, label: "In Stock" },
        { id: 1, value: lowStock, label: "Low Stock" },
        { id: 2, value: outOfStock, label: "Out of Stock" }
    ];

    return (
        <EcomChartContainer title="Stock Status Distribution" isEmpty={products.length === 0}>
            <PieChart
                series={[
                    {
                        data,
                        innerRadius: 60,
                        highlightScope: { fade: 'global', highlight: 'item' },
                    },
                ]}
                height={300}
            />
        </EcomChartContainer>
    );
};

export default StockStatusChart;
