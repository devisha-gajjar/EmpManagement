import React, { useState } from "react";
import {
  TextField,
  IconButton,
  InputAdornment,
  type TextFieldProps,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type PasswordFieldProps = TextFieldProps & {
  height?: number | string;
};

const PasswordField: React.FC<PasswordFieldProps> = ({
  height = 55,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <TextField
      {...props}
      fullWidth
      variant="outlined"
      type={showPassword ? "text" : "password"}
      sx={{
        "& .MuiOutlinedInput-root": {
          height: typeof height === "number" ? `${height}px` : height,
          borderRadius: "8px",
          fontSize: "1rem",
          backgroundColor:
            document.documentElement.dataset.theme === "dark"
              ? "#1f2933"
              : "#ffffff",
          color:
            document.documentElement.dataset.theme === "dark"
              ? "#f9fafb"
              : "#111827",

          "&.Mui-focused": {
            boxShadow: "0 0 0 4px rgba(37, 99, 235, 0.25)",
          },

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#d1d5db",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#249bfcb2",
            borderWidth: "0.5px",
          },
        },

        "& input::placeholder": {
          color:
            document.documentElement.dataset.theme === "dark"
              ? "#9ca3af"
              : "#6b7280",
          opacity: 1,
        },
      }}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={togglePasswordVisibility}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default PasswordField;
