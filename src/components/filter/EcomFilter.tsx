import React from "react";

interface EcomFilterProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const EcomFilter: React.FC<EcomFilterProps> = ({
  title,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <div className="border-bottom">
      <div
        className="d-flex justify-content-between align-items-center p-3 cursor-pointer"
        onClick={onToggle}
      >
        <h6 className="filter-title-text mb-0">{title}</h6>
        <i
          className={`fa-solid fa-chevron-${isOpen ? "up" : "down"} text-muted`}
        ></i>
      </div>

      {isOpen && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
};

export default EcomFilter;