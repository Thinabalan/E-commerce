import { Controller, useFormContext } from "react-hook-form";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";

interface Option {
  label: string;
  value: string;
}

interface EcomRadioGroupProps {
  name: string;
  label: string;
  options: Option[];
}

const EcomRadioGroup = ({
  name,
  label,
  options,
}: EcomRadioGroupProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl error={Boolean(fieldState.error)} component="fieldset">
          <FormLabel>{label}</FormLabel>
          <RadioGroup {...field} row>
            {options.map((opt) => (
              <FormControlLabel
                key={opt.value}
                value={opt.value}
                control={<Radio size="small" sx={{ transform: "scale(0.9)" }} />}
                label={opt.label}
              />
            ))}
          </RadioGroup>
          {fieldState.error && (
            <FormHelperText sx={{ ml: 0 }}>{fieldState.error.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}

export default EcomRadioGroup;