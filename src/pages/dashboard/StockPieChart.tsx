import type { Product } from '../../types/ProductTypes';
import EcomPieChart from '../../components/newcomponents/EcomPieChart';

interface StockStatusChartProps {
    products: Product[];
}

const StockStatusChart = ({ products }: StockStatusChartProps) => {
    const inStock = products.filter(p => Number(p.stock ?? 0) > 10).length;
    const lowStock = products.filter(p => Number(p.stock ?? 0) > 0 && Number(p.stock ?? 0) <= 10).length;
    const outOfStock = products.filter(p => Number(p.stock ?? 0) === 0).length;

    const data = [
        { id: 0, value: inStock, label: "In Stock" },
        { id: 1, value: lowStock, label: "Low Stock" },
        { id: 2, value: outOfStock, label: "Out of Stock" }
    ];

    return (
        <EcomPieChart
            title="Stock Status Distribution"
            data={data}
            innerRadius={60}
            arcLabel={(item) => `${item.value}`}
        />
    );
};

export default StockStatusChart;
