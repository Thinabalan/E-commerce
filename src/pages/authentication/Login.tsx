import { Link, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Typography
} from "@mui/material";

import EcomTextField from "../../components/newcomponents/EcomTextField";
import EcomButton from "../../components/newcomponents/EcomButton";
import { useSnackbar } from "../../context/SnackbarContext";
import { useUser } from "../../hooks/useUser";
import type { LoginForm } from "../../types/types";

// Validation Schema
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
});

interface LoginProps {
  onSuccess?: () => void;
  switchToSignup?: () => void;
}

const Login = ({ onSuccess, switchToSignup } : LoginProps ) => {
  const navigate = useNavigate();
  const { getUsers } = useUser();
  const { showSnackbar } = useSnackbar();

  const loginform = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const { handleSubmit, formState: { isSubmitting } } = loginform;

  const onSubmit = async (data: LoginForm) => {
    try {
      const users = await getUsers({ email: data.email, password: data.password });

      if (users.length === 0) {
        showSnackbar("Invalid email or password", "error");
        return;
      }

      // Temporary login storage 
      localStorage.setItem("user", JSON.stringify(users[0]));
      window.dispatchEvent(new Event("auth-change"));

      showSnackbar(`Welcome back ${users[0].name}`, "success");

      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => navigate("/"), 1000);
      }

    } catch {
      showSnackbar("Something went wrong. Please try again.", "error");
    }
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mb={2}
      >
        <Typography variant="body2" color="textSecondary">
          Welcome back! Please enter your details.
        </Typography>
      </Box>

      <FormProvider {...loginform}>
        <form onSubmit={(e) => e.preventDefault()} noValidate>
          <Box display="flex" flexDirection="column" gap={3} sx={{ width: 310 }}>
            <EcomTextField
              name="email"
              label="Email"
              size="small"
              type="email"
              required
            />

            <EcomTextField
              name="password"
              label="Password"
              size="small"
              type="password"
              required
            />

            <EcomButton
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
              label={isSubmitting ? "Logging in..." : "Login"}
              sx={{ width: 130, alignSelf: "center" }}
            />
          </Box>
        </form>
      </FormProvider>

      <Box mt={1} textAlign="center">
        <Typography variant="body2" color="textSecondary">
          Don't have an account?{" "}
          {switchToSignup ? (
            <EcomButton
              color="primary"
              onClick={switchToSignup}
              label="Sign up"
              sx={{ textTransform: "none", fontWeight: "bold", p: 0, minWidth: "auto" }}
            />
          ) : (
            <Link
              to="/signup"
              style={{
                textDecoration: "none",
                color: "#1976d2",
                fontWeight: "bold"
              }}
            >
              Sign up
            </Link>
          )}
        </Typography>
      </Box>
    </>
  );

};

export default Login;


