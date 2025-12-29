import { createContext, useContext, useState, useEffect } from "react";
import EcomToast from "../components/toast/EcomToast";


type ToastType = "success" | "error" | "info";

interface ToastOptions {
  message: string;
  type?: ToastType;
  actionText?: string;
  onAction?: () => void;
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const [show, setShow] = useState(false);

  const showToast = (options: ToastOptions) => {
    setToast(options);
    setShow(true);
  };

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <EcomToast
          show={show}
          message={toast.message}
          type={toast.type}
          actionText={toast.actionText}
          onAction={toast.onAction}
          onClose={() => setShow(false)}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
};
