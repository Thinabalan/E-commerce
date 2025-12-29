import React, { type ChangeEvent } from "react";

interface EcomTextAreaProps {
  label: string;
  name: string;
  value: string;
  rows?: number;
  required?: boolean;
  error?: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
}

const EcomTextArea = ({
  label,
  name,
  value,
  rows = 3,
  required = false,
  error,
  placeholder = label,
  onChange,
  onBlur,
}: EcomTextAreaProps) => {
  return (
    <div className="mb-3">
      <label className="form-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>

      <textarea
        className={`form-control ${error ? "is-invalid" : ""}`}
        name={name}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
      />

      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default EcomTextArea;
