import { Box, Typography } from "@mui/material";
import logo from "../../assets/logo-removebg.png";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
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
      ></Box>

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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 3,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Employee Mgmt Logo"
            sx={{
              height: 48,
              width: "auto",
            }}
          />

          <Typography
            variant="h5"
            fontWeight={700}
            lineHeight={1}
            color="#022369ff"
            fontFamily={"cursive"}
          >
            EMPLOYEE MANAGEMENT
          </Typography>
        </Box>
        {children}
      </Box>
    </Box>
  );
}
