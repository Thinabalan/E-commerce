import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";

interface EcomTextFieldProps {
    name: string;
    label?: string;
    type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
    size?: "small" | "medium";
    fullWidth?: boolean;
    required?: boolean;
    multiline?: boolean;
    rows?: number;
    disabled?: boolean;
    showErrorText?: boolean;
}

const getNestedValue = (obj: any, path: string) => {
    if (!obj || !path) return undefined;

    return path.split(".").reduce((acc: any, key: string) => {
        if (acc === undefined || acc === null) return undefined;
        return acc[key];
    }, obj);
};

const EcomTextField = ({
    name,
    label,
    type = "text",
    size = "medium",
    fullWidth = true,
    required = false,
    multiline = false,
    rows = 1,
    disabled = false,
    showErrorText = true, 
}: EcomTextFieldProps) => {
    const { control, formState: { errors } } = useFormContext();
    const error = getNestedValue(errors, name);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <TextField
                    {...field}
                    label={label}
                    type={type}
                    size={size}
                    fullWidth={fullWidth}
                    required={required}
                    multiline={multiline}
                    rows={rows}
                    error={!!error}
                    disabled={disabled}
                    helperText={showErrorText && (error?.message as string)}
                    slotProps={{
                        formHelperText: {
                            sx: {
                                ml: 0,
                                pl: 0,
                            },
                        },
                    }}

                />
            )}
        />
    );
};

export default EcomTextField;
