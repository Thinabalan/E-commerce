import type { Product } from "../../types/ProductTypes";
import EcomPieChart from "../../components/newcomponents/EcomPieChart";

interface ProductPieChartProps {
    products: Product[];
}

const ProductPieChart = ({ products }: ProductPieChartProps) => {
    const sortedProducts = [...products]
        .map((p) => ({
            label: p.productName,
            value: Number(p.stock ?? 0),
        }))
        .sort((a, b) => b.value - a.value);

    const TOP_LIMIT = 5;

    const topProducts = sortedProducts.slice(0, TOP_LIMIT);
    const remainingProducts = sortedProducts.slice(TOP_LIMIT);

    const othersValue = remainingProducts.reduce(
        (sum, item) => sum + item.value,
        0
    );

    const finalData = [
        ...topProducts,
        ...(othersValue > 0 ? [{ label: "Others", value: othersValue }] : []),
    ];

    const data = finalData.map((item, index) => ({
        id: index,
        value: item.value,
        label: item.label,
        color:
            item.label === "Others"
                ? "#BDBDBD" // grey
                : `hsl(${(index * 360) / finalData.length}, 65%, 55%)`,
    }));

    return (
        <EcomPieChart
            title="Top Products by Stock"
            data={data}
            innerRadius={0}
            paddingAngle={0}
            cornerRadius={0}
        />
    );
};

export default ProductPieChart;
