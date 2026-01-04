import { Controller, useFormContext } from "react-hook-form";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
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
    <>
      <FormLabel>{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
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
        )}
      />
    </>
  );
}

export default EcomRadioGroup;