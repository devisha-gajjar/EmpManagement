import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import { googleLogin, login } from "../../features/auth/authApi";

import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  useTheme,
} from "@mui/material";
import { emailRegex } from "../../utils/constant";
import AuthLayout from "../../components/layout/AuthLayout";
import PasswordField from "../../components/shared/password-field/PasswordField";
import { clearReturnUrl } from "../../features/auth/authSlice";
import { GoogleLogin } from "@react-oauth/google";

// validation errors
interface ValidationErrors {
  usernameOrEmail?: string;
  password?: string;
}

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { loading, error, isAuthenticated, role, returnUrl, loginStep } =
    useAppSelector((state) => state.auth);

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

  const handleRegisterClick = (e: any) => {
    e.preventDefault();
    navigate("/register");
  };

  // const handleGoogleResponse = (response: any) => {
  //   const idToken = response.credential;

  //   if (!idToken) {
  //     console.error("Google ID Token not received");
  //     return;
  //   }

  //   dispatch(googleLogin(idToken));
  // };

  useEffect(() => {
    if (!isAuthenticated || !role) return;

    if (returnUrl) {
      navigate(returnUrl, { replace: true });
      dispatch(clearReturnUrl());
      return;
    }

    switch (role) {
      case "admin":
        navigate("/admin/employees", { replace: true });
        break;
      case "user":
        navigate("/user/dashboard", { replace: true });
        break;
      default:
        navigate("/login", { replace: true });
    }
  }, [isAuthenticated, role, returnUrl, navigate, dispatch]);

  useEffect(() => {
    if (loginStep === "require_2fa") {
      navigate("/auth/2fa");
    }

    if (loginStep === "require_2fa_setup") {
      navigate("/auth/2fa-setup");
    }
  }, [loginStep]);

  return (
    <AuthLayout>
      <Box
        sx={{
          width: "100%",
          maxWidth: 520,
          background: theme.palette.background.paper,
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

          {/* <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            name="password"
            onChange={handleChange}
            error={!!validationErrors.password}
            helperText={validationErrors.password}
          /> */}
          <PasswordField
            fullWidth
            label="Password"
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
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const idToken = credentialResponse.credential;

                if (!idToken) {
                  console.error("Google ID Token not received");
                  return;
                }

                dispatch(googleLogin(idToken));
              }}
              onError={() => {
                console.error("Google Login Failed");
              }}
              useOneTap={false}
            />
          </Box>

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
              Don't have an account?
              <Link
                component="button"
                sx={{
                  ml: 1,
                  textDecoration: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                onClick={(e) => handleRegisterClick(e)}
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
