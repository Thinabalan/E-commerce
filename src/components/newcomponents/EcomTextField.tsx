import { Controller, useFormContext } from "react-hook-form";
import {
    TextField,
    Tooltip,
    InputAdornment,
    IconButton,
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/ErrorOutline";

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
    const {
        control,
        formState: { errors },
    } = useFormContext();

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
                    disabled={disabled}
                    error={!!error}
                    helperText={showErrorText ? (error?.message as string) : undefined}
                    slotProps={{
                        input: {
                            endAdornment:
                                !showErrorText && error ? (
                                    <InputAdornment position="end">
                                        <Tooltip title={error?.message || ""} arrow>
                                            <IconButton size="small" tabIndex={-1}>
                                                <ErrorIcon
                                                    color="error"
                                                    fontSize={size === "small" ? "small" : "medium"}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                ) : undefined,
                        },
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
