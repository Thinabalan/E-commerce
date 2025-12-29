import { Controller, useFormContext } from "react-hook-form";
import type { FieldValues, Path } from "react-hook-form";
import { TextField } from "@mui/material";

interface EcomTextFieldProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
    fullWidth?: boolean;
    required?: boolean;
    multiline?: boolean;
    rows?: number;
}

const EcomTextField = <T extends FieldValues>({
    name,
    label,
    type = "text",
    fullWidth = true,
    required = false,
    multiline = false,
    rows = 1,
}: EcomTextFieldProps<T>) => {
    const { control, formState: { errors } } = useFormContext<T>();
    const error = errors[name];

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <TextField
                    {...field}
                    label={label}
                    type={type}
                    fullWidth={fullWidth}
                    required={required}
                    multiline={multiline}
                    rows={rows}
                    error={!!error}
                    helperText={error?.message as string}
                />
            )}
        />
    );
};

export default EcomTextField;
