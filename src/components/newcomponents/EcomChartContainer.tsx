import { Box, Typography, Paper } from '@mui/material';
import { type ReactNode } from 'react';

interface ChartContainerProps {
    title: string;
    children: ReactNode;
    height?: number | string;
    isEmpty?: boolean;
    headerAction?: React.ReactNode;
}

const EcomChartContainer = ({ title, children, height = 450, isEmpty = false, headerAction }: ChartContainerProps) => {
    return (
        <Paper
            sx={{
                p: 3,
                borderRadius: '16px',
                height: height,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: '#1a1a1a' }}
                >
                    {title}
                </Typography>
                {headerAction}
            </Box>
            <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', flexGrow: 1, alignItems: 'center' }}>
                {isEmpty ? (
                    <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 500 }}>
                        No product data available
                    </Typography>
                ) : (
                    children
                )}
            </Box>
        </Paper>
    );
};

export default EcomChartContainer;
