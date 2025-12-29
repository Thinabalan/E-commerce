import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material";

interface EcomButtonProps extends ButtonProps {
  label: string;
}

const EcomButton = ({
  label,
  type = "button",
  ...props
}: EcomButtonProps) => {
  return (
    <Button type={type} {...props}>
      {label}
    </Button>
  );
};

export default EcomButton;
