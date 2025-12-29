import React from "react";

interface TabItem {
  key: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (key: string) => void;
}

const EcomTab: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div style={{ display: "flex", borderBottom: "1px solid #ddd" }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className="tab-btn"
            style={{
              padding: "10px 16px",
              cursor: "pointer",
              border: "none",
              background: "none",
              borderBottom: isActive
                ? "2px solid #1976d2"
                : "2px solid transparent",
              fontWeight: isActive ? 600 : 400,
              color: isActive ? "#1976d2" : "#6c757d",
              transition: "0.3s",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default EcomTab;
