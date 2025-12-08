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
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        mt: 8,
        background: "#f7f7f7ff",
        padding: "2rem",
        borderRadius: "18px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          color="primary"
          sx={{ mb: 3, fontWeight: 700 }}
        >
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="usernameOrEmail"
            label="Email or Username"
            name="usernameOrEmail"
            autoComplete="email"
            autoFocus
            onChange={handleChange}
            error={!!validationErrors.usernameOrEmail}
            helperText={validationErrors.usernameOrEmail}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange}
            error={!!validationErrors.password}
            helperText={validationErrors.password}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 1 }}
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </Button>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <Typography variant="body2">
              Not a user?
              <Link
                component="button"
                variant="body2"
                onClick={handleRegisterClick}
                sx={{ ml: 1, textDecoration: "none", cursor: "pointer" }}
              >
                Register Now
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
