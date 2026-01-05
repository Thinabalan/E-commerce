import { Controller, useFormContext } from "react-hook-form";
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";

interface Option {
    value: string | number;
    label: string;
}

interface EcomDropdownProps {
    name: string;
    label: string;
    options: Option[];
    fullWidth?: boolean;
    required?: boolean;
}

const EcomDropdown: React.FC<EcomDropdownProps> = ({
    name,
    label,
    options,
    fullWidth = true,
    required = false,
}) => {
    const { control, formState: { errors } } = useFormContext();
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
                        {options.map((opt, index) => (
                            <MenuItem
                                key={`${name}-${opt.value}-${index}`}
                                value={opt.value}
                            >
                                {opt.label}
                            </MenuItem>
                        ))}

                    </Select>
                    {error && <FormHelperText sx={{ ml: 0 }}>{error.message as string}</FormHelperText>}
                </FormControl>
            )}
        />
    );
};

export default EcomDropdown;
