import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";

import EcomButton from "../../components/button/EcomButton";
import { useToast } from "../../context/ToastContext";
import { useForm } from "../../hooks/useForm";
import EcomTextField from "../../components/textfield/EcomTextField";
import { useUser } from "../../hooks/useUser";
import type { CreateUser } from "../../types/types";
import {
  validateConfirmPasswordField,
  validateEmailField,
  validateNameField,
  validatePasswordField
} from "../../utils/validation";

interface SignupProps {
  onSwitchLogin?: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSwitchLogin }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { getUsers, createUser } = useUser();

  const [errors, setErrors] = useState<Partial<Record<keyof CreateUser, string>>>({});

  const { form, handleChange } = useForm<CreateUser>({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    handleChange(e);
    // Live validation: Clear error when user types
    if (errors[name as keyof CreateUser]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateUser, string>> = {};

    newErrors.name = validateNameField(form.name);
    newErrors.email = validateEmailField(form.email);
    newErrors.password = validatePasswordField(form.password);
    newErrors.confirmPassword = validateConfirmPasswordField(form.password, form.confirmPassword || "");

    setErrors(newErrors);

    return !Object.values(newErrors).some(error => error !== "");
  };

  // Form submit 
  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      showToast({
        message: "Please fix the errors in the form",
        type: "error"
      });
      return;
    }

    // if (!form.name || !form.email || !form.password || !form.confirmPassword) {
    //   showToast({
    //     message: "All fields are required",
    //     type: "error"
    //   });
    //   return;
    // }

    try {
      const existingUsers = await getUsers({ email: form.email });
      if (existingUsers.length > 0) {
        setErrors(prev => ({ ...prev, email: "User already exists" }));
        showToast({ message: "User already exists", type: "error" });
        return;
      }

      await createUser({
        name: form.name,
        email: form.email,
        password: form.password
      });

      showToast({ message: "Signup successful", type: "success" });

      if (onSwitchLogin) {
        onSwitchLogin();
      } else {
        setTimeout(() => navigate("/login"), 1500);
      }

    } catch (error) {
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

              <h4 className="text-center mb-4">Create Account</h4>

              <form onSubmit={handleSignup}>

                <EcomTextField
                  label="Name"
                  name="name"
                  value={form.name}
                  required
                  error={errors.name}
                  onChange={handleInputChange}
                />

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

                <EcomTextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword || ""}
                  required
                  error={errors.confirmPassword}
                  onChange={handleInputChange}
                />

                <EcomButton
                  text="Sign Up"
                  type="submit"
                  className="btn btn-primary w-100"
                />
              </form>

              <p className="text-center mt-3 mb-0">
                Already have an account?{" "}
                {onSwitchLogin ? (
                  <button className="link-btn" onClick={onSwitchLogin}>
                    Login
                  </button>
                ) : (
                  <Link to="/login">Login</Link>
                )}
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
