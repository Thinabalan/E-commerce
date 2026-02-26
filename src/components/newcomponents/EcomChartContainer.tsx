import { Box, Typography, Paper, IconButton, Menu, MenuItem } from '@mui/material';
import { type ReactNode, useRef, useState } from 'react';
import { Download as DownloadIcon } from '@mui/icons-material';
import { downloadAsPNG, downloadAsSVG } from '../../utils/chartExportUtils';

interface ChartContainerProps {
    title: string;
    children: ReactNode;
    height?: number | string;
    isEmpty?: boolean;
    headerAction?: React.ReactNode;
    enableDownload?: boolean;
}

const EcomChartContainer = ({
    title,
    children,
    height = 450,
    isEmpty = false,
    headerAction,
    enableDownload = true,
}: ChartContainerProps) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDownloadPNG = async () => {
        await downloadAsPNG(chartRef, title);
        handleClose();
    };

    const handleDownloadSVG = async () => {
        await downloadAsSVG(chartRef, title);
        handleClose();
    };

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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {headerAction}
                    {enableDownload && !isEmpty && (
                        <>
                            <IconButton size="small" onClick={handleMenuOpen}>
                                <DownloadIcon fontSize="small" />
                            </IconButton>
                            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                                <MenuItem onClick={handleDownloadPNG}>Download PNG</MenuItem>
                                <MenuItem onClick={handleDownloadSVG}>Download SVG</MenuItem>
                            </Menu>
                        </>
                    )}
                </Box>
            </Box>
            <Box
                ref={chartRef}
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    flexGrow: 1,
                    alignItems: 'center',
                    bgcolor: 'transparent',
                }}
            >
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
