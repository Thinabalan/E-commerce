import { Typography, Box } from "@mui/material";
import { SHORTCUTS } from "./ShortcutList";
import EcomModal from "../../components/newcomponents/EcomModal";

type ShortcutHelpModalProps = {
    open: boolean;
    onClose: () => void;
};

export default function ShortcutManual({ open, onClose }: ShortcutHelpModalProps) {
    return (
        <EcomModal
            open={open}
            onClose={onClose}
            title="Keyboard Shortcuts"
            width={450}
        >
            {SHORTCUTS.map((section) => (
                <Box key={section.category} mb={3}>
                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        mb={1.5}
                    >
                        {section.category}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {section.items.map((item, i) => (
                            <Box
                                key={i}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Typography variant="body2">{item.description}</Typography>
                                <Typography
                                    variant="caption"
                                    fontWeight={600}
                                >
                                    {item.keys}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            ))}
        </EcomModal>
    );
}
