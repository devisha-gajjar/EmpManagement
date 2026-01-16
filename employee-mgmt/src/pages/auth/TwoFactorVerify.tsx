import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { verify2FA } from "../../features/auth/authApi";
import { useNavigate } from "react-router-dom";

export default function TwoFactorVerify() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { tempToken, loading, error } = useAppSelector((state) => state.auth);

  const [code, setCode] = useState("");

  const handleVerify = () => {
    if (!tempToken || code.length !== 6) return;

    dispatch(
      verify2FA({
        tempToken,
        code,
      })
    )
      .unwrap()
      .then(() => navigate("/", { replace: true }));
  };

  return (
    <Box sx={{ maxWidth: 380, mx: "auto", mt: 10 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={700} mb={1}>
          Two-Factor Authentication
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Enter the 6-digit code from Google Authenticator.
        </Typography>

        <TextField
          fullWidth
          label="Authentication code"
          value={code}
          onChange={(e) =>
            setCode(e.target.value.replaceAll(/\D/g, "").slice(0, 6))
          }
          margin="normal"
          slotProps={{
            htmlInput: {
              maxLength: 6,
              inputMode: "numeric",
              autoComplete: "one-time-code",
            },
          }}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          disabled={loading || code.length !== 6}
          onClick={handleVerify}
        >
          Verify
        </Button>
      </Paper>
    </Box>
  );
}
