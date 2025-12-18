import { Box } from "@mui/material";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* LEFT IMAGE */}
      <Box
        sx={{
          width: "50%",
          display: { xs: "none", md: "block" },
          backgroundImage: `url(/src/assets/19766.jpg)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* RIGHT FORM */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#e9f2fcff",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
