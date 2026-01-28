import { Link, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Typography,
  Grid
} from "@mui/material";

import EcomTextField from "../../components/newcomponents/EcomTextField";
import EcomButton from "../../components/newcomponents/EcomButton";
import { useSnackbar } from "../../context/SnackbarContext";
import { useUser } from "../../hooks/useUser";
import type { CreateUser } from "../../types/types";

interface SignupFormValues extends CreateUser {
  confirmPassword: string;
}

// Validation Schema
const signupSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match")
});

interface SignupProps {
  onSwitchLogin?: () => void;
}

const Signup = ({ onSwitchLogin }: SignupProps ) => {
  const navigate = useNavigate();
  const { getUsers, createUser } = useUser();
  const { showSnackbar } = useSnackbar();

  const signupform = useForm<SignupFormValues>({
    resolver: yupResolver(signupSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const { handleSubmit, setError, formState: { isSubmitting } } = signupform;

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const existingUsers = await getUsers({ email: data.email });
      if (existingUsers.length > 0) {
        setError("email", { type: "manual", message: "User already exists" });
        showSnackbar("User already exists", "error");
        return;
      }

      await createUser({
        name: data.name,
        email: data.email,
        password: data.password
      });

      showSnackbar("Signup successful", "success");

      if (onSwitchLogin) {
        onSwitchLogin();
      } else {
        setTimeout(() => navigate("/login"), 1500);
      }

    } catch (error) {
      showSnackbar("Something went wrong. Please try again.", "error");
    }
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mb={3}
      >
        <Typography variant="body2" color="textSecondary">
          Join us today! Please fill in your details.
        </Typography>
      </Box>

      <FormProvider {...signupform}>
        <form onSubmit={(e) => e.preventDefault()} noValidate>
          <Grid container spacing={2}>
            <Grid size={12}>
              <EcomTextField
                name="name"
                label="Full Name"
                size="small"
                required
              />
            </Grid>

            <Grid size={12}>
              <EcomTextField
                name="email"
                label="Email"
                type="email"
                size="small"
                required
              />
            </Grid>

            <Grid size={12}>
              <EcomTextField
                name="password"
                label="Password"
                type="password"
                size="small"
                required
              />
            </Grid>

            <Grid size={12}>
              <EcomTextField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                size="small"
                required
              />
            </Grid>

            <Grid size={12} display="flex" justifyContent="center">
              <EcomButton
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                onClick={handleSubmit(onSubmit)}
                label={isSubmitting ? "Creating Account..." : "Sign Up"}
                sx={{ width: 130 }}
              />
            </Grid>
          </Grid>
        </form>
      </FormProvider>

      <Box mt={1} textAlign="center">
        <Typography variant="body2" color="textSecondary">
          Already have an account?{" "}
          {onSwitchLogin ? (
            <EcomButton
              color="primary"
              onClick={onSwitchLogin}
              label="Login"
              sx={{ textTransform: "none", fontWeight: "bold", p: 0, minWidth: "auto" }}
            />
          ) : (
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                color: "#1976d2",
                fontWeight: "bold"
              }}
            >
              Login
            </Link>
          )}
        </Typography>
      </Box>
    </>
  );

};

export default Signup;



