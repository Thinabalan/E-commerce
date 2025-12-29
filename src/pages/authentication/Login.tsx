import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";

import EcomButton from "../../components/button/EcomButton";
import { useToast } from "../../context/ToastContext";
import { useForm } from "../../hooks/useForm";
import EcomTextField from "../../components/textfield/EcomTextField";
import { useUser } from "../../hooks/useUser";
import type { LoginForm } from "../../types/types";
import { validateEmailField, validatePasswordField } from "../../utils/validation";

interface Props {
  onSuccess?: () => void;
  switchToSignup?: () => void;
}

const Login: React.FC<Props> = ({ onSuccess, switchToSignup }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { getUsers } = useUser();

  const [errors, setErrors] = useState<Partial<Record<keyof LoginForm, string>>>({});

  const { form, handleChange } = useForm<LoginForm>({
    email: "",
    password: ""
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    handleChange(e);
    // Live validation: Clear error when user types
    if (errors[name as keyof LoginForm]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LoginForm, string>> = {};

    newErrors.email = validateEmailField(form.email);
    newErrors.password = validatePasswordField(form.password);

    setErrors(newErrors);

    return !Object.values(newErrors).some(error => error !== "");
  };

  // Form submit 
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      showToast({
        message: "Please fix the errors in the form",
        type: "error"
      });
      return;
    }

    // if (!form.email || !form.password) {
    //   showToast({
    //     message: "Email and password are required",
    //     type: "error"
    //   });
    //   return;
    // }

    try {
      const users = await getUsers({ email: form.email, password: form.password });

      if (users.length === 0) {
        showToast({
          message: "Invalid email or password",
          type: "error"
        });
        return;
      }

      // Temporary login storage 
      localStorage.setItem("user", JSON.stringify(users[0]));
      window.dispatchEvent(new Event("auth-change"));

      showToast({ message: `Welcome back ${users[0].name}`, type: "success" });

      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => navigate("/"), 1000);
      }

    } catch {
      showToast({
        message: "Something went wrong. Please try again.",
        type: "error"
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body">

              <h4 className="text-center mb-4">Login</h4>

              <form onSubmit={handleLogin}>

                <EcomTextField
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  required
                  error={errors.email}
                  onChange={handleInputChange}
                />

                <EcomTextField
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  required
                  error={errors.password}
                  onChange={handleInputChange}
                />

                <EcomButton
                  text="Login"
                  type="submit"
                  className="btn btn-primary w-100 mt-2"
                />

              </form>

              <p className="text-center mt-3 mb-0">
                Don’t have an account?{" "}
                {switchToSignup ? (
                  <button className="link-btn" onClick={switchToSignup}>
                    Signup
                  </button>
                ) : (
                  <Link to="/signup">Sign up</Link>
                )}
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
