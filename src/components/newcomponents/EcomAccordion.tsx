import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface EcomAccordionProps {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

const EcomAccordion = ({
    title,
    isOpen,
    onToggle,
    children,
}: EcomAccordionProps ) => {
    return (
        <Accordion
            expanded={isOpen}
            onChange={onToggle}
            disableGutters
            elevation={0}
            sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:before': { display: 'none' },
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />}
                sx={{
                    px: 2,
                    py: 1,
                    '& .MuiAccordionSummary-content': { my: 0 }
                }}
            >
                <Typography
                    sx={{
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: 'text.primary',
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase'
                    }}
                >
                    {title}
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
                {children}
            </AccordionDetails>
        </Accordion>
    );
};

export default EcomAccordion;
