import "./EcomButton.css";

interface BtnProps {
  icon?: string;
  text?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  form?: string;
  onClick?: () => void;
}

const EcomButton: React.FC<BtnProps> = ({
  icon,
  text,
  className = "",
  type = "button",
  disabled = false,
  form,
  onClick
}) => {
  return (
    <button
      type={type}
      className={`ecom-btn ${className}`}
      onClick={onClick}
      disabled={disabled}
      form={form}
    >
      {icon && <i className={icon}></i>}
      {text && <span>{text}</span>}
    </button>
  );
};

export default EcomButton;
