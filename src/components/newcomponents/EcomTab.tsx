import { Tabs, Tab, Box } from "@mui/material";

export interface TabItem {
  label: string;
  value: string;
  count?: number;
  color?: "default" | "success" | "error" | "warning" | "info";
}

interface TabProps {
  value: string;
  tabs: TabItem[];
  onChange: (value: string) => void;
}

const EcomTab = ({
  value,
  tabs,
  onChange,
}: TabProps) => {
  return (
    <Box mb={2} sx={{ borderBottom: 2, borderColor: 'divider' }}>
      <Tabs
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
      >
        {tabs.map((tab) => (
          <Tab
            key={String(tab.value)}
            value={tab.value}
            label={
              tab.count !== undefined
                ? `${tab.label} (${tab.count})`
                : tab.label
            }
            sx={{
              minHeight: 44,
              px: { xs: 1.5, sm: 3 },
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              textTransform: "none",
              color:
                tab.color === "success"
                  ? "success.main"
                  : tab.color === "error"
                    ? "error.main"
                    : "text.secondary",
              "&.Mui-selected": {
                bgcolor: "whitesmoke",
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
}

export default EcomTab;