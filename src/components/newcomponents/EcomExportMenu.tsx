import { useState } from "react";
import {
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import type { ExportFormat } from "../../utils/export";

interface EcomExportMenuProps {
    onExport: (format: ExportFormat) => void;
    tooltipTitle?: string;
}

const EcomExportMenu = ({
    onExport,
    tooltipTitle = "Export Options",
}: EcomExportMenuProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleExport = (format: ExportFormat) => {
        onExport(format);
        handleClose();
    };

    return (
        <>
            <Tooltip title={tooltipTitle}>
                <IconButton
                    onClick={handleClick}
                    color="primary"
                    sx={{
                        boxShadow: 1,
                        bgcolor: "background.paper",
                        "&:hover": { bgcolor: "grey.100" },
                    }}
                >
                    <FileDownloadIcon />
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        elevation: 3,
                        sx: { mt: 1.5, minWidth: 180 },
                    },
                }}
            >
                <MenuItem onClick={() => handleExport("CSV")}>
                    <ListItemIcon>
                        <ReceiptLongIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Export as CSV" />
                </MenuItem>
                <MenuItem onClick={() => handleExport("EXCEL")}>
                    <ListItemIcon>
                        <TableChartIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Export as Excel" />
                </MenuItem>
                <MenuItem onClick={() => handleExport("PDF")}>
                    <ListItemIcon>
                        <PictureAsPdfIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Export as PDF" />
                </MenuItem>
            </Menu>
        </>
    );
};

export default EcomExportMenu;
