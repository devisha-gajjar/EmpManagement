import { Box, Card, CardContent, Typography } from "@mui/material";
import type {
  DashboardCardProps,
  InfoTextProps,
  CenteredProps,
} from "../../interfaces/dashboard.interface";

export function DashboardCard({ title, children }: DashboardCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        background: "linear-gradient(180deg, #ffffff, #edf4faff)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        transition: "0.3s",
        border: "0.1px solid #1976d233",
        height: "100%",
        "&:hover": {
          boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 700, color: "primary.main" }}
        >
          {title}
        </Typography>

        {children}
      </CardContent>
    </Card>
  );
}

export function InfoText({ label, value }: InfoTextProps) {
  return (
    <Box sx={{ mb: 1.2 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={600}>
        {value ?? "—"}
      </Typography>
    </Box>
  );
}

export function CenteredContainer({ children }: CenteredProps) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="70vh"
      sx={{ textAlign: "center" }}
    >
      {children}
    </Box>
  );
}
