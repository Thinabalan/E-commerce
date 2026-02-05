import { Link, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Grid,
  Typography
} from "@mui/material";

import EcomTextField from "../../components/newcomponents/EcomTextField";
import EcomButton from "../../components/newcomponents/EcomButton";
import { useUI } from "../../context/UIContext";
import { useUser } from "../../hooks/useUser";
import { loginSchema } from "../../schema/AuthenticationSchema";
import type { LoginForm } from "../../types/AuthenticationTypes";
import { useAuth } from "../../context/AuthContext";

interface LoginProps {
  onSuccess?: () => void;
  switchToSignup?: () => void;
}

const Login = ({ onSuccess, switchToSignup }: LoginProps) => {
  const navigate = useNavigate();
  const { getUsers } = useUser();
  const { showSnackbar } = useUI();
  const { login } = useAuth();

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
      const users = await getUsers(data);

      if (users.length === 0) {
        showSnackbar("Invalid email or password", "error");
        return;
      }

      login(users[0]);
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
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box display="flex" flexDirection="column" gap={3} sx={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <EcomTextField
                  name="email"
                  label="Email"
                  size="small"
                  type="email"
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <EcomTextField
                  name="password"
                  label="Password"
                  size="small"
                  type="password"
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }} display="flex" justifyContent="center">
                <EcomButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  label={isSubmitting ? "Logging in..." : "Login"}
                  sx={{ width: '40%', py: 1.2, borderRadius: '8px' }}
                />
              </Grid>
            </Grid>
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


