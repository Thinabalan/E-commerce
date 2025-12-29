import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import type { FormValues } from "./types";

interface EcomTextFieldProps {
  name: keyof FormValues;
  label: string;
  type?: "text" | "email" | "password" | "number" | "date";
  multiline?: boolean;
  rows?: number;
}

const EcomTextField = ({
  name,
  label,
  type = "text",
  multiline = false,
  rows,
}: EcomTextFieldProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          type={type}
          label={label}
          fullWidth
          margin="normal"
          multiline={multiline}
          rows={rows}
          error={!!errors[name]}
          helperText={errors[name]?.message as string | undefined}
          slotProps={{ inputLabel: { shrink: true, }, }}
        />
      )}    />
  );
};

export default EcomTextField;
