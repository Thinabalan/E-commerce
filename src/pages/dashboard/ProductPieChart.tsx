import { PieChart } from "@mui/x-charts/PieChart";
import type { Product } from "../../types/ProductTypes";
import EcomChartContainer from "../../components/newcomponents/EcomChartContainer";

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

    // const COLORS = [
    //     "#4CAF50", // green
    //     "#2196F3", // blue
    //     "#FF9800", // orange
    //     "#9C27B0", // purple
    //     "#00BCD4", // cyan
    // ];

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
        <EcomChartContainer
            title="Top Products by Stock"
            isEmpty={products.length === 0}
        >
            <PieChart
                series={[
                    {
                        data,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                        innerRadius: 40,
                        paddingAngle: 5,
                        cornerRadius: 5,
                    },
                ]}
                height={300}
            />
        </EcomChartContainer>
    );
};

export default ProductPieChart;