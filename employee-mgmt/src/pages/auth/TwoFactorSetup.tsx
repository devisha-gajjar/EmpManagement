import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  useTheme,
} from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setup2FA, verify2FA } from "../../features/auth/authApi";
import { useNavigate } from "react-router-dom";

export default function TwoFactorSetup() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const { tempToken, loading, error } = useAppSelector((state) => state.auth);

  const [qrCodeUri, setQrCodeUri] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");

  // Load QR + secret on mount
  useEffect(() => {
    if (!tempToken) {
      console.log("... from the setup");
      navigate("/login", { replace: true });
      return;
    }

    dispatch(setup2FA())
      .unwrap()
      .then((res) => {
        setQrCodeUri(res.qrCodeUri);
        setSecret(res.secret);
      })
      .catch(console.error);
  }, [tempToken]);

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
    <Box sx={{ maxWidth: 420, mx: "auto", mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={700} mb={1}>
          Set up Two-Factor Authentication
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Scan the QR code using Google Authenticator, then enter the 6-digit
          code.
        </Typography>

        {qrCodeUri && (
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <QRCodeSVG
              value={qrCodeUri}
              size={220}
              level="M"
              bgColor="#ffffff"
              fgColor="#000000"
              marginSize={4}
            />
          </Box>
        )}

        {secret && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Can't scan? Enter this key manually:
            </Typography>

            <Typography
              sx={{
                fontFamily: "monospace",
                bgcolor: theme.palette.background.default,
                color: theme.palette.text.primary,
                p: 1,
                borderRadius: 1,
                mt: 0.5,
                textAlign: "center",
                letterSpacing: 1,
              }}
            >
              {secret}
            </Typography>
          </Box>
        )}

        <TextField
          fullWidth
          label="6-digit authentication code"
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
          <Alert severity="error" sx={{ mt: 1 }}>
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
          Verify & Enable
        </Button>
      </Paper>
    </Box>
  );
}
