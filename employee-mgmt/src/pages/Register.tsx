import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { registerUser } from "../features/auth/authApi";
import { clearAuthStatus } from "../features/auth/authSlice";
import type { RegisterData } from "../features/auth/interfaces/login.interface";
import { emailRegex, phoneRegex } from "../utils/constant";

type ValidationErrors = Partial<Record<keyof RegisterData, string>>;

const inputFields = [
  {
    label: "First Name",
    name: "firstName",
    type: "text",
    autoComplete: "given-name",
    width: "50%",
  },
  {
    label: "Last Name",
    name: "lastName",
    type: "text",
    autoComplete: "family-name",
    width: "50%",
  },
  {
    label: "Username",
    name: "username",
    type: "text",
    autoComplete: "username",
    width: "100%",
  },
  {
    label: "Email",
    name: "email",
    type: "email",
    autoComplete: "email",
    width: "100%",
  },
  {
    label: "Password",
    name: "password",
    type: "password",
    autoComplete: "new-password",
    width: "100%",
  },
  {
    label: "Confirm Password",
    name: "confirmPassword",
    type: "password",
    autoComplete: "new-password",
    width: "100%",
  },
  {
    label: "Phone",
    name: "phone",
    type: "tel",
    autoComplete: "tel",
    width: "50%",
  },
  {
    label: "Zipcode",
    name: "zipcode",
    type: "text",
    autoComplete: "postal-code",
    width: "50%",
  },
  {
    label: "Address",
    name: "address",
    type: "text",
    autoComplete: "street-address",
    width: "100%",
  },
];

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error, registerSuccess, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const [form, setForm] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    zipcode: "",
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [localValidationError, setLocalValidationError] = useState<
    string | null
  >(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setForm({ ...form, [name]: value });
  };

  const validateForm = (): boolean => {
    let errors: ValidationErrors = {};
    let isValid = true;
    const requiredFields: Array<keyof RegisterData> = [
      "firstName",
      "lastName",
      "username",
      "email",
      "password",
      "confirmPassword",
      "phone",
      "address",
      "zipcode",
    ];

    requiredFields.forEach((field) => {
      if (!form[field].trim()) {
        const displayFieldName = field.replace(/([A-Z])/g, " $1").trim();
        errors[field] = `${displayFieldName} is required.`;
        isValid = false;
      }
    });

    if (form.email.trim() && !emailRegex.test(form.email)) {
      errors.email = "Please enter a valid email address.";
      isValid = false;
    }
    if (form.password.trim() && form.password.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
      isValid = false;
    }
    if (
      form.password.trim() &&
      form.confirmPassword.trim() &&
      form.password !== form.confirmPassword
    ) {
      errors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }
    if (form.phone.trim() && !phoneRegex.test(form.phone)) {
      errors.phone =
        "Please enter a valid 10-digit phone number (e.g., 5551234567).";
      isValid = false;
    }
    if (
      form.zipcode.trim() &&
      (form.zipcode.length !== 6 || isNaN(Number(form.zipcode)))
    ) {
      errors.zipcode = "Zipcode must be 6 digits.";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearAuthStatus());
    setLocalValidationError(null);

    if (validateForm()) {
      dispatch(registerUser(form));
    } else {
      setLocalValidationError(
        "Please correct the highlighted errors in the form before submitting."
      );
    }
  };

  const handleCancel = () => {
    navigate("/login");
    dispatch(clearAuthStatus());
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

  const groupedFields = inputFields.reduce<Array<typeof inputFields>>(
    (acc, field) => {
      if (
        field.width === "50%" &&
        acc.length > 0 &&
        acc[acc.length - 1].length < 2 &&
        acc[acc.length - 1][0].width === "50%"
      ) {
        acc[acc.length - 1].push(field);
      } else {
        acc.push([field]);
      }
      return acc;
    },
    []
  );

  return (
    <Container
      component="main"
      maxWidth="sm"
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
          Create Your Account
        </Typography>

        {/* error state or local validation error */}
        {(error || localValidationError) && (
          <Alert severity="error" sx={{ width: "100%", mb: 3 }}>
            {error || localValidationError}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1, width: "100%" }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {groupedFields.map((group, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: group.length > 1 ? "row" : "column",
                }}
              >
                {group.map((field) => (
                  <TextField
                    key={field.name}
                    required
                    fullWidth
                    label={field.label}
                    name={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    value={form[field.name as keyof RegisterData]}
                    onChange={handleChange}
                    error={
                      !!validationErrors[field.name as keyof ValidationErrors]
                    }
                    helperText={
                      validationErrors[field.name as keyof ValidationErrors]
                    }
                    sx={{
                      flexGrow: 1,
                      width: field.width,
                    }}
                  />
                ))}
              </Box>
            ))}
          </Box>

          <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ flexGrow: 1, p: 1.5 }}
            >
              {loading ? "Registering..." : "Register"}
            </Button>

            <Button
              type="button"
              variant="outlined"
              color="inherit"
              onClick={handleCancel}
              sx={{ flexGrow: 1, p: 1.5 }}
            >
              Cancel
            </Button>
          </Box>
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
          <Typography variant="body2" className="login-link">
            Already have an account?
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate("/login")}
              sx={{
                ml: 1,
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
    </Container>
  );
}
