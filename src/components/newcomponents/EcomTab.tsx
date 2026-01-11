import { Tabs, Tab, Box } from "@mui/material";

export interface TabItem<T = string> {
  label: string;
  value: T;
  count?: number;
  color?: "default" | "success" | "error" | "warning" | "info";
}

interface TabProps<T = string> {
  value: T;
  tabs: TabItem<T>[];
  onChange: (value: T) => void;
}

export default function EcomTab<T = string>({
  value,
  tabs,
  onChange,
}: TabProps<T>) {
  return (
    <Box mb={2}>
      <Tabs
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        variant="fullWidth"
        sx={{
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 600,
            borderBottom: 1,
            borderColor: "divider",
          },
        }}
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
