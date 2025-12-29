import { Controller, useFormContext } from "react-hook-form";
import type { FieldValues, Path } from "react-hook-form";
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";

interface Option {
    value: string | number;
    label: string;
}

interface EcomDropdownProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    options: Option[];
    fullWidth?: boolean;
    required?: boolean;
}

const EcomDropdown = <T extends FieldValues>({
    name,
    label,
    options,
    fullWidth = true,
    required = false,
}: EcomDropdownProps<T>) => {
    const { control, formState: { errors } } = useFormContext<T>();
    const error = errors[name];

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <FormControl fullWidth={fullWidth} required={required} error={!!error}>
                    <InputLabel>{label}</InputLabel>
                    <Select
                        {...field}
                        label={label}
                        MenuProps={{ style: { zIndex: 3000 } }}
                    >
                        {options.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </Select>
                    {error && <FormHelperText>{error.message as string}</FormHelperText>}
                </FormControl>
            )}
        />
    );
};

export default EcomDropdown;
