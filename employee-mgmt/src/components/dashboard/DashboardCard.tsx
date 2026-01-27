import { Box, Card, CardContent, Skeleton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type {
  DashboardCardProps,
  InfoTextProps,
  CenteredProps,
} from "../../interfaces/dashboard.interface";

export function DashboardCard({
  title,
  children,
  loading = false,
}: Readonly<DashboardCardProps>) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Card
      sx={{
        borderRadius: 3,
        height: "100%",
        background: isDark
          ? "linear-gradient(180deg, #1e1e1e, #2a2a2a)"
          : "linear-gradient(180deg, #ffffff, #edf4faff)",
        boxShadow: isDark
          ? "0 4px 20px rgba(0,0,0,0.6)"
          : "0 4px 20px rgba(0,0,0,0.08)",
        border: isDark
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid #1976d233",
        transition: "0.3s",
      }}
    >
      <CardContent>
        {loading ? (
          <>
            <Skeleton
              width="60%"
              height={30}
              sx={{ bgcolor: isDark ? "grey.800" : "grey.300" }}
            />
            <Skeleton
              height={20}
              sx={{ mt: 2, bgcolor: isDark ? "grey.800" : "grey.300" }}
            />
            <Skeleton
              height={20}
              sx={{ bgcolor: isDark ? "grey.800" : "grey.300" }}
            />
            <Skeleton
              height={20}
              width="80%"
              sx={{ bgcolor: isDark ? "grey.800" : "grey.300" }}
            />
          </>
        ) : (
          <>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: isDark ? "primary.light" : "primary.main",
              }}
            >
              {title}
            </Typography>

            {children}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function InfoText({ label, value }: Readonly<InfoTextProps>) {
  return (
    <Box sx={{ mb: 1.2 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={600} color="text.primary">
        {value ?? "—"}
      </Typography>
    </Box>
  );
}

export function CenteredContainer({ children }: Readonly<CenteredProps>) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="70vh"
      textAlign="center"
    >
      {children}
    </Box>
  );
}