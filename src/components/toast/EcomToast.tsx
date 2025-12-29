interface ToastProps {
  show: boolean;
  message: string;
  type?: "success" | "error" | "info";
  actionText?: string;
  onAction?: () => void;
  onClose: () => void;
}

const EcomToast: React.FC<ToastProps> = ({
  show,
  message,
  type = "success",
  actionText,
  onAction,
  onClose
}) => {
  if (!show) return null;

  const bgClass =
    type === "success"
      ? "bg-success"
      : type === "error"
      ? "bg-danger"
      : "bg-primary";

  return (
<div className="toast-container position-fixed top-0 start-50 translate-middle-x mt-5">
  <div className={`toast show text-white ${bgClass} px-2 py-1 fs-6 shadow-lg`}>
    <div className="toast-body d-flex justify-content-between align-items-center">
      <span>{message}</span>

          <div className="ms-3">
            {actionText && onAction && (
              <button
                className="btn btn-sm btn-light me-2"
                onClick={onAction}
              >
                {actionText}
              </button>
            )}

            <button
              className="btn-close btn-close-white"
              onClick={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcomToast;
