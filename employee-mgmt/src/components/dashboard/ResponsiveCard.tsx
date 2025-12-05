import { Box } from "@mui/material";

export function ResponsiveCard({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ flex: "1 1 calc(33.33% - 24px)", minWidth: "330px" }}>
      {children}
    </Box>
  );
}
