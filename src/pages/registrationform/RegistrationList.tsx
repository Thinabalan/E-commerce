import {
  Paper,
  Typography,
  Divider,
  Box,
  Container,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistration } from "../../hooks/registrationform/useRegistration";
import EcomTable, { type Column } from "../../components/newcomponents/EcomTable";
import EcomDialog from "../../components/newcomponents/EcomDialog";
import EcomButton from "../../components/newcomponents/EcomButton";
import { formatDate } from "../../utils/formatDate";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";

const RegistrationList = () => {
  const { getRegistrationsList, registrations } = useRegistration();
  const [isFullViewOpen, setIsFullViewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getRegistrationsList();
  }, []);

  const flattenedRows = useMemo(() => {
    return registrations.map((row) => ({
      ...row,
      sellerName: row.seller.name,
      sellerEmail: row.seller.email,
      warehouseNames: row.seller.warehouses.map((w) => w.warehouseName).join(", "),
      businessNames: row.businesses.map((b) => b.businessName).join(", "),
    }));
  }, [registrations]);

  const columns: Column<any>[] = [
    { id: "sellerName", label: "Seller Name", align: "left" },
    { id: "sellerEmail", label: "Email", align: "left" },
    { id: "warehouseNames", label: "Warehouses", align: "left" },
    { id: "businessNames", label: "Businesses", align: "left" },
    {
      id: "submittedAt",
      label: "Submitted At",
      align: "center",
      render: (row) => (row.submittedAt ? formatDate(row.submittedAt) : "—"),
    },
    {
      id: "actions",
      label: "Actions",
      align: "center",
      sortable: false,
      render: (row) => (
        <Box display="flex" justifyContent="center" gap={1}>
          <Tooltip title="Preview">
            <IconButton
              size="small"
              color="info"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewData(row);
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                 const { 
        sellerName, 
        sellerEmail, 
        warehouseNames, 
        businessNames, 
        ...originalData 
      } = row;
                navigate(`/form/${row.id}`, { state: { registrationData: originalData } });
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const tableContent = (
    <EcomTable
      rows={flattenedRows}
      columns={columns as any}
      emptyMessage="No registrations found."
      renderRowDetails={(row) => (
        <Box
          p={3}
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.02)",
            borderTop: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="subtitle2" color="primary" gutterBottom fontWeight="bold">
            Detailed Registration Info
          </Typography>

          <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr 1fr" }} gap={3}>
            {/* Seller Info */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" mb={1} color="text.secondary">
                Seller Information
              </Typography>
              <Box
                sx={{
                  p: 1,
                  bgcolor: "#fff",
                  borderRadius: 1,
                  border: "1px solid #f0f0f0",
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  NAME: {row.seller.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  EMAIL: {row.seller.email}
                </Typography>
              </Box>
            </Box>

            {/* Warehouses */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" mb={1} color="text.secondary">
                Warehouses ({row.seller.warehouses.length})
              </Typography>

              {row.seller.warehouses.map((w: any, i: number) => (
                <Box
                  key={i}
                  mb={1}
                  sx={{
                    p: 1,
                    bgcolor: "#fff",
                    borderRadius: 1,
                    border: "1px solid #f0f0f0",
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    WAREHOUSE NAME: {w.warehouseName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    CITY: {w.city}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    PINCODE: {w.pincode}
                  </Typography>
                  {w.upload && (
                    <Typography variant="caption" display="block" color="primary.main">
                      File: {w.upload}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>

            {/* Businesses */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" mb={1} color="text.secondary">
                Businesses ({row.businesses.length})
              </Typography>

              {row.businesses.map((b: any, i: number) => (
                <Box
                  key={i}
                  mb={2}
                  sx={{
                    p: 1,
                    bgcolor: "#fff",
                    borderRadius: 1,
                    border: "1px solid #f0f0f0",
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    BUSINESS NAME: {b.businessName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    EMAIL: {b.businessEmail}
                  </Typography>

                  <Divider sx={{ my: 0.5 }} />

                  <Typography variant="caption" fontWeight="bold">
                    Products:
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    {b.products.map((p: any, j: number) => (
                      <Typography key={j} component="li" variant="caption">
                        {p.productName} ({p.category}) - ₹{p.price} | Stock: {p.stock}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    />
  );

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", py: 8 }}>
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 5 },
            mx: "auto",
            borderRadius: 4,
            boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
            border: "1px solid #edf2f7",
          }}
        >
          <Box mb={4} textAlign="center">
            <Box display="flex" alignItems="center" justifyContent="center" gap={2} sx={{ position: "relative" }}>
              <Typography
                variant="h5"
                fontWeight={600}
                color="primary.main"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                Submitted Registrations
                <Tooltip title="Open Full Screen">
                  <IconButton onClick={() => setIsFullViewOpen(true)} color="primary" size="small">
                    <OpenInFullIcon />
                  </IconButton>
                </Tooltip>
              </Typography>
              <EcomButton
                label="Register"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/form")}
                sx={{ position: { md: "absolute" }, right: { md: 0 } }}
              />
            </Box>

            <Typography variant="body1" color="text.secondary">
              Review and manage all submitted business registration forms.
            </Typography>
          </Box>

          {tableContent}
        </Paper>
      </Container>

      <EcomDialog
        fullScreen
        open={isFullViewOpen}
        onClose={() => setIsFullViewOpen(false)}
        title="Registrations Full View"
        headerSx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          boxShadow: 5,
        }}
      >
        <Box sx={{ p: 4, bgcolor: "#f5f7fa", minHeight: "calc(100vh - 64px)" }}>
          {tableContent}
        </Box>
      </EcomDialog>

      {/* Preview Dialog */}
      <EcomDialog
        maxWidth="md"
        fullWidth
        open={Boolean(previewData)}
        onClose={() => setPreviewData(null)}
        title="Registration Preview"
        headerSx={{
          bgcolor: "grey.800",
          color: "common.white",
          boxShadow: 3,
        }}

      >
        <Box sx={{ p: previewData ? 0 : 4 }}>
          {previewData && (
            <Box sx={{ "& .MuiBox-root": { borderTop: "none" } }}>
              {tableContent.props.renderRowDetails(previewData)}
            </Box>
          )}
        </Box>
      </EcomDialog>
    </Box>
  );
};

export default RegistrationList;
