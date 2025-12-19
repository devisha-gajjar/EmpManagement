import { Box, Typography } from "@mui/material";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* LEFT IMAGE WITH TEXT OVERLAY */}
      <Box
        sx={{
          width: "50%",
          display: { xs: "none", md: "block" },
          position: "relative",
          backgroundImage: "url(/src/assets/19766.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* DARK OVERLAY */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
          }}
        />

        {/* TEXT CONTENT */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            textAlign: "center",
            px: 4,
            zIndex: 1,
          }}
        >
          <Typography variant="h3" fontWeight={800} letterSpacing={1.5}>
            Employee Mgmt
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, maxWidth: 420, opacity: 0.9 }}>
            Simplify employee management with a secure and modern platform
          </Typography>
        </Box>
      </Box>

      {/* RIGHT FORM */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#e9f2fc",
          px: 3,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
