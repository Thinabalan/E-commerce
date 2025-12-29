import React, { type ChangeEvent } from "react";

interface Option {
  label: string;
  value: string;
}

interface EcomDropdownProps {
  label: string;
  name: string;
  value: string;
  options: Option[];
  required?: boolean;
  error?: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
}

const EcomDropdown = ({
  label,
  name,
  value,
  options,
  required = false,
  error,
  onChange,
  onBlur,
}: EcomDropdownProps) => {
  return (
    <div className="mb-3">
      <label className="form-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>

      <select
        className={`form-select ${error ? "is-invalid" : ""}`}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
      >
        <option value="">Select {label}</option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default EcomDropdown;
