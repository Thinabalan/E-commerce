import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, type SxProps, type Theme } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface EcomAccordionProps {
    title: string;
    isOpen: boolean;
    onToggle: (event: React.SyntheticEvent, isExpanded: boolean) => void;
    children: React.ReactNode;
    icon?: React.ReactNode;
    error?: boolean;
    sx?: SxProps<Theme>;
}

const EcomAccordion = ({
    title,
    isOpen,
    onToggle,
    children,
    icon,
    error = false,
    sx = {},
}: EcomAccordionProps) => {
    return (
        <Accordion
            expanded={isOpen}
            onChange={onToggle}
            disableGutters
            elevation={2}
            sx={{
                border: "1px solid #edf2f7",
                borderRadius: "12px !important",
                "&:before": { display: "none" },
                overflow: "hidden",
                m:1,
                ...sx
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                    bgcolor: "rgba(25, 118, 210, 0.04)",
                    px: 3,
                    '& .MuiAccordionSummary-content': {
                        my: 1.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 2
                    }
                }}
            >
                {icon && (
                    <Box sx={{ display: "flex", alignItems: "center", color: error ? "error.main" : "primary.main" }}>
                        {icon}
                    </Box>
                )}
                <Typography
                    sx={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: error ? 'error.main' : 'text.primary',
                    }}
                >
                    {title}
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, pb: 4, pt: 2 }}>
                {children}
            </AccordionDetails>
        </Accordion>
    );
};

export default EcomAccordion;
