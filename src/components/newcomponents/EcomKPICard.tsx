import { Paper, Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface KPICardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    color: string;
}

const EcomKPICard = ({ title, value, icon, color }: KPICardProps) => {
    return (
        <Paper
            sx={{
                p: 1.5,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                }
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px',
                    backgroundColor: `${color}15`,
                    color: color,
                }}
            >
                {icon}
            </Box>
            <Box>
                <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 600 }}>
                    {title}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    {value}
                </Typography>
            </Box>
        </Paper>
    );
};

export default EcomKPICard;
