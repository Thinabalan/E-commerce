import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import "./AuthModal.css";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const [mode, setMode] = useState<"login" | "signup">("login");

  if (!open) return null;

  return (
    <>
      {/* BACKDROP */}
      <div className="auth-backdrop" onClick={onClose} />

      {/* MODAL */}
      <div className="auth-modal">
        <button className="auth-close" onClick={onClose}>×</button>

        {mode === "login" ? (
          <Login
            onSuccess={onClose}
            switchToSignup={() => setMode("signup")}
          />
        ) : (
          <Signup
            onSwitchLogin={() => setMode("login")}
          />
        )}
      </div>
    </>
  );
};

export default AuthModal;
