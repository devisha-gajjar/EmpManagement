import React, { useState, useEffect, useRef } from "react";
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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { emailRegex, siteKey } from "../../utils/constant";
import AuthLayout from "../../components/layout/AuthLayout";
import PasswordField from "../../components/shared/password-field/PasswordField";
import { clearReturnUrl } from "../../features/auth/authSlice";
import { GoogleLogin } from "@react-oauth/google";

interface ValidationErrors {
  usernameOrEmail?: string;
  password?: string;
}

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const {
    loading,
    error,
    isAuthenticated,
    role,
    returnUrl,
    loginStep,
    failedLoginAttempt,
  } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    usernameOrEmail: "",
    password: "",
    rememberMe: false,
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [captchaToken, setCaptchaToken] = useState<string>("");

  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  const showCaptcha = failedLoginAttempt > 2 || error === "Captcha required.";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (validationErrors[e.target.name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [e.target.name]: undefined,
      }));
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      rememberMe: e.target.checked,
    }));
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
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
      dispatch(
        login({
          email: form.usernameOrEmail,
          password: form.password,
          rememberMe: form.rememberMe,
          captchaToken: captchaToken,
        })
      );
    }
  };

  const handleRegisterClick = (e: any) => {
    e.preventDefault();
    navigate("/register");
  };

  // ✅ Render Turnstile ONCE inside useEffect — NOT in the ref callback.
  // The ref callback fires on every re-render which caused duplicate widgets.
  useEffect(() => {
    if (!showCaptcha) return;
    if (!containerRef.current) return;
    if (!window.turnstile) return;

    // Already rendered — skip
    if (widgetIdRef.current) return;

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token: string) => setCaptchaToken(token),
      "error-callback": () => setCaptchaToken(""),
      "expired-callback": () => setCaptchaToken(""),
    });

    // Cleanup on unmount or when captcha hides
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
        setCaptchaToken("");
      }
    };
  }, [showCaptcha]);

  // ✅ Reset the existing widget after each failed attempt
  useEffect(() => {
    if (!showCaptcha) return;
    if (!widgetIdRef.current) return;
    if (!window.turnstile) return;

    window.turnstile.reset(widgetIdRef.current);
    setCaptchaToken("");
  }, [failedLoginAttempt]);

  // Navigate after successful login
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

  // Navigate to 2FA steps
  useEffect(() => {
    if (loginStep === "require_2fa") {
      navigate("/auth/2fa");
    }
    if (loginStep === "require_2fa_setup") {
      navigate("/auth/2fa-setup");
    }
  }, [loginStep, navigate]);

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

          <PasswordField
            fullWidth
            label="Password"
            name="password"
            onChange={handleChange}
            error={!!validationErrors.password}
            helperText={validationErrors.password}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={form.rememberMe}
                onChange={handleCheckboxChange}
                color="primary"
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                Remember me
              </Typography>
            }
          />

          {/* ✅ Simple div — Turnstile is injected via useEffect, not ref callback */}
          {showCaptcha && (
            <div ref={containerRef} style={{ margin: "20px 0" }} />
          )}

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
