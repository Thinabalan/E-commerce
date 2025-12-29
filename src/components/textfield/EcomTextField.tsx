import React, { type ChangeEvent } from "react";

interface EcomTextFieldProps {
  id?: string;
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "number";
  value: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const EcomTextField = ({
  id,
  label,
  name,
  type = "text",
  value,
  required = false,
  placeholder = label,
  error,
  onChange,
  onBlur,
}: EcomTextFieldProps) => {
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={id || name}>
        {label} {required && <span className="text-danger">*</span>}
      </label>

      <input
        id={id || name}
        className={`form-control ${error ? "is-invalid" : ""}`}
        name={name}
        type={type}
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

export default EcomTextField;
