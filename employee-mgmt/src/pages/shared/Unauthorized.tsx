import { Box, Typography, Button, Paper } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";

export function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f5f5f5",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          maxWidth: 420,
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        <LockOutlinedIcon sx={{ fontSize: 60, color: "error.main", mb: 2 }} />

        <Typography variant="h4" fontWeight={600}>
          Unauthorized
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
          You don’t have permission to view this page.  
          Please contact your administrator if you believe this is a mistake.
        </Typography>

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={() => navigate(-1)}
          sx={{ mb: 1, borderRadius: 2 }}
        >
          Go Back
        </Button>

        <Button
          variant="outlined"
          size="large"
          fullWidth
          onClick={() => navigate("/login")}
          sx={{ borderRadius: 2 }}
        >
          Go to Login
        </Button>
      </Paper>
    </Box>
  );
}
