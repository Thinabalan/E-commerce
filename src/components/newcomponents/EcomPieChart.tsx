import type { ReactNode } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import EcomChartContainer from "./EcomChartContainer";

interface PieChartData {
    id: number | string;
    value: number;
    label?: string;
    color?: string;
}

interface EcomPieChartProps {
    title: string;
    data: PieChartData[];
    isEmpty?: boolean;
    height?: number;
    innerRadius?: number;
    paddingAngle?: number;
    cornerRadius?: number;
    arcLabel?: (item: any) => string;
    onSliceClick?: (item: any) => void;
    headerAction?: ReactNode;
}

const EcomPieChart = ({
    title,
    data,
    isEmpty = data.length === 0,
    height = 300,
    innerRadius = 30,
    paddingAngle = 5,
    cornerRadius = 5,
    arcLabel,
    onSliceClick,
    headerAction,
}: EcomPieChartProps) => {
    return (
        <EcomChartContainer
            title={title}
            isEmpty={isEmpty}
            headerAction={headerAction}
        >
            <PieChart
                series={[
                    {
                        data,
                        highlightScope: { fade: 'global', highlight: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                        innerRadius,
                        paddingAngle,
                        cornerRadius,
                        arcLabel,

                    },
                ]}
                height={height}
                onItemClick={(_event, params) => {
                    const clickedItem = data[params.dataIndex];
                    onSliceClick?.(clickedItem);
                }}
            />
        </EcomChartContainer>
    );
};

export default EcomPieChart;
