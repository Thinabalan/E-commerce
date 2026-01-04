import { useFormContext, Controller } from "react-hook-form";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
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
      render={({ field }) => {
        const selectedValues: string[] = field.value || [];

        const handleChange = (value: string) => {
          if (selectedValues.includes(value)) {
            field.onChange(selectedValues.filter((v) => v !== value));
          } else {
            field.onChange([...selectedValues, value]);
          }
        };

        return (
          <>
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
          </>
        );
      }}
    />
  );
}

export default EcomCheckbox;