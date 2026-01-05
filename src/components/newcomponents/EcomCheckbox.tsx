import { useFormContext, Controller } from "react-hook-form";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";

interface Option {
  label: string;
  value: string;
}

interface EcomCheckboxProps {
  name: string;
  label: string;
  options: Option[];
}

const EcomCheckbox = ({
  name,
  label,
  options,
}: EcomCheckboxProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selectedValues: string[] = field.value || [];

        const handleChange = (value: string) => {
          if (selectedValues.includes(value)) {
            field.onChange(selectedValues.filter((v) => v !== value));
          } else {
            field.onChange([...selectedValues, value]);
          }
        };

        return (
          <FormControl error={Boolean(fieldState.error)} component="fieldset">
            <FormLabel>{label}</FormLabel>
            <FormGroup row>
              {options.map((opt) => (
                <FormControlLabel
                  key={opt.value}
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedValues.includes(opt.value)}
                      onChange={() => handleChange(opt.value)}
                    />
                  }
                  label={opt.label}
                />
              ))}
            </FormGroup>
            {fieldState.error && (
              <FormHelperText sx={{ ml: 0 }}>{fieldState.error.message}</FormHelperText>
            )}
          </FormControl>
        );
      }}
    />
  );
}

export default EcomCheckbox;