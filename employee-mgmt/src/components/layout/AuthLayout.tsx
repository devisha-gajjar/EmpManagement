import { Box, Typography, Switch, useTheme } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import logo from "../../assets/logo-removebg.png";
import { toggleTheme } from "../../features/shared/themeSlice";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.theme.mode);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      {/* LEFT IMAGE PANEL */}
      <Box
        sx={{
          width: "50%",
          display: { xs: "none", md: "block" },
          backgroundImage: "url(/src/assets/19766.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* RIGHT AUTH PANEL */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(180deg, #010E1D 0%, #011A33 100%)"
              : "linear-gradient(180deg, #F4F7FB 0%, #FFFFFF 100%)",
          px: 3,
          py: 4,
        }}
      >
        {/* THEME TOGGLE (FLOATING) */}
        <Box
          sx={{
            position: "absolute",
            top: 20,
            right: 24,
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            py: 0.5,
            borderRadius: "999px",
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.05)",
            backdropFilter: "blur(8px)",
          }}
        >
          {mode === "light" ? (
            <LightModeIcon fontSize="small" />
          ) : (
            <DarkModeIcon fontSize="small" />
          )}

          <Switch
            checked={mode === "dark"}
            onChange={() => dispatch(toggleTheme())}
            sx={{
              width: 42,
              height: 24,
              p: 0,
              "& .MuiSwitch-switchBase": {
                p: 0.5,
                "&.Mui-checked": {
                  transform: "translateX(18px)",
                  color: "#fff",
                  "& + .MuiSwitch-track": {
                    backgroundColor: theme.palette.primary.main,
                    opacity: 1,
                  },
                },
              },
              "& .MuiSwitch-thumb": {
                width: 17,
                height: 17,
              },
              "& .MuiSwitch-track": {
                borderRadius: 12,
                opacity: 1,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(0,0,0,0.25)",
              },
            }}
          />
        </Box>

        {/* CONTENT WRAPPER */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 520,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* BRAND HEADER */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 4,
            }}
          >
            {/* LOGO CONTAINER */}
            <Box
              sx={{
                height: 52,
                width: 52,
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(135deg, #4A90E2, #022536)"
                    : "linear-gradient(135deg, #10386d, #4A90E2)",
              }}
            >
              <Box
                component="img"
                src={logo}
                alt="Employee Management"
                sx={{
                  height: 37,
                  width: "auto",
                  filter: "brightness(0) invert(1)",
                }}
              />
            </Box>

            {/* BRAND TEXT */}
            <Box>
              <Typography
                variant="h6"
                fontWeight={800}
                letterSpacing="0.8px"
                lineHeight={1.1}
                color={theme.palette.text.primary}
              >
                WORKDESK
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                letterSpacing="0.6px"
                sx={{ opacity: 0.7 }}
              >
                Employee Management
              </Typography>
            </Box>
          </Box>

          {children}
        </Box>
      </Box>
    </Box>
  );
}
