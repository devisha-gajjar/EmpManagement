import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import { login } from "../../features/auth/authApi";

import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
} from "@mui/material";
import { emailRegex } from "../../utils/constant";
import AuthLayout from "../../components/layout/AuthLayout";

// validation errors
interface ValidationErrors {
  usernameOrEmail?: string;
  password?: string;
}

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, role } = useAppSelector(
    (state) => state.auth
  );

  const [form, setForm] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (validationErrors[e.target.name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [e.target.name]: undefined,
      }));
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = (): boolean => {
    let errors: ValidationErrors = {};
    let isValid = true;

    if (!form.usernameOrEmail.trim()) {
      errors.usernameOrEmail = "Email or Username is required.";
      isValid = false;
    }
    if (!form.password.trim()) {
      errors.password = "Password is required.";
      isValid = false;
    }

    if (form.password.trim() && form.password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
      isValid = false;
    }

    if (
      form.usernameOrEmail.includes("@") &&
      !emailRegex.test(form.usernameOrEmail)
    ) {
      errors.usernameOrEmail = "Please enter a valid email address.";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      dispatch(login(form));
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  useEffect(() => {
    if (isAuthenticated && role) {
      console.log("Role", role);
      switch (role) {
        case "admin":
          navigate("/admin/employees");
          break;
        case "user":
          navigate("/user/dashboard");
          break;
        default:
          navigate("/login");
      }
    }
  }, [isAuthenticated, role, navigate]);

  return (
    <AuthLayout>
      <Box
        sx={{
          width: "100%",
          maxWidth: 520,
          background: "#ffffff",
          p: 6,
          borderRadius: "18px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={1}>
          Welcome back
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Sign in to manage your team
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email or Username"
            margin="normal"
            name="usernameOrEmail"
            onChange={handleChange}
            error={!!validationErrors.usernameOrEmail}
            helperText={validationErrors.usernameOrEmail}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            name="password"
            onChange={handleChange}
            error={!!validationErrors.password}
            helperText={validationErrors.password}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, py: 1.2, borderRadius: 2 }}
            disabled={loading}
            type="submit"
          >
            {loading ? "Signing in..." : "Login"}
          </Button>

          <Box
            sx={{
              mt: 3,
              pt: 1,
              borderTop: "1px solid #eee",
              width: "100%",
              textAlign: "center",
            }}
          >
            <Typography align="center" variant="body2">
              Don’t have an account?
              <Link
                component="button"
                sx={{
                  ml: 1,
                  textDecoration: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                onClick={handleRegisterClick}
              >
                Register
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </AuthLayout>
  );
}
