import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Link, useTheme } from "@mui/material";
import DynamicFormComponent from "../../components/shared/form/CommonForm";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { registerUser } from "../../features/auth/authApi";
import { clearAuthStatus } from "../../features/auth/authSlice";
import type { RegisterData } from "../../interfaces/login.interface";
import { RegisterFormFields } from "./configs/registerForm.config";
import AuthLayout from "../../components/layout/AuthLayout";

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const { loading, registerSuccess, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const handleSubmit = (data: RegisterData) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // No mapper — BE DTO compatible
    dispatch(registerUser(data));
  };

  const handleCancel = () => {
    dispatch(clearAuthStatus());
    navigate("/login");
  };

  useEffect(() => {
    if (registerSuccess) {
      navigate("/login", { state: { registerSuccess } });
      dispatch(clearAuthStatus());
    }
  }, [registerSuccess, navigate, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/employees");
    }
  }, [isAuthenticated, navigate]);

  return (
    <AuthLayout>
      <Box
        component="main"
        maxWidth="sm"
        sx={{
          width: "100%",
          maxWidth: 820,
          background: theme.palette.background.paper,
          borderRadius: "18px",
          p: 6,
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={1}>
          Register an account
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={4}>
          Create your workspace to manage teams efficiently
        </Typography>

        <DynamicFormComponent
          formConfig={RegisterFormFields}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="Register"
          cancleLabel="Cancel"
          loading={loading}
          defaultValues={{
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
            address: "",
            zipcode: "",
          }}
        />
        <Box
          sx={{
            mt: 2,
            pt: 1,
            borderTop: "1px solid #eee",
            width: "100%",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" className="login-link">
            Already have an account?
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate("/login")}
              sx={{
                ml: 1,
                mb: 0.5,
                textDecoration: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Log in here
            </Link>
          </Typography>
        </Box>
      </Box>
    </AuthLayout>
  );
}
