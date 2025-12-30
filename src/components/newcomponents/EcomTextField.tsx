import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";

interface EcomTextFieldProps {
    name: string;
    label: string;
    type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
    fullWidth?: boolean;
    required?: boolean;
    multiline?: boolean;
    rows?: number;
}

const EcomTextField: React.FC<EcomTextFieldProps> = ({
    name,
    label,
    type = "text",
    fullWidth = true,
    required = false,
    multiline = false,
    rows = 1,
}) => {
    const { control, formState: { errors } } = useFormContext();
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
