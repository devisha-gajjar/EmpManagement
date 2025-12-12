import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0a1929 0%, #1e3a8a 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          bottom: "15%",
          right: "15%",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background: "rgba(139, 92, 246, 0.1)",
          filter: "blur(80px)",
        }}
      />

      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* 404 Icon */}
          <Box
            sx={{
              mb: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                fontSize: { xs: "80px", md: "120px" },
                fontWeight: 800,
                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1,
              }}
            >
              404
            </Box>
          </Box>

          {/* Error Message */}
          <Typography
            variant="h3"
            sx={{
              color: "#e3e8ef",
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "28px", md: "40px" },
            }}
          >
            Page Not Found
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#94a3b8",
              mb: 4,
              fontSize: { xs: "16px", md: "18px" },
              maxWidth: "600px",
              mx: "auto",
              lineHeight: 1.8,
            }}
          >
            Oops! The page you're looking for seems to have wandered off. It
            might have been moved, deleted, or perhaps it never existed.
          </Typography>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
              mt: 4,
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(-1)}
              startIcon={<i className="bi bi-arrow-left"></i>}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "16px",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                boxShadow: "0 8px 20px rgba(59, 130, 246, 0.4)",
                transition: "all 0.3s",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 28px rgba(59, 130, 246, 0.5)",
                },
              }}
            >
              Go Back
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/")}
              startIcon={<i className="bi bi-house-door-fill"></i>}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "16px",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "12px",
                color: "#3b82f6",
                borderColor: "rgba(59, 130, 246, 0.5)",
                transition: "all 0.3s",
                "&:hover": {
                  borderColor: "#3b82f6",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Go Home
            </Button>
          </Box>

          {/* Helper Links */}
          <Box
            sx={{
              mt: 6,
              pt: 4,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                mb: 2,
                fontSize: "14px",
              }}
            >
              Need help? Try these links:
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 3,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Box
                component="a"
                href="/dashboard"
                sx={{
                  color: "#94a3b8",
                  textDecoration: "none",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  transition: "color 0.2s",
                  "&:hover": {
                    color: "#3b82f6",
                  },
                }}
              >
                <i className="bi bi-grid-fill"></i> Dashboard
              </Box>
              <Box
                component="a"
                href="/support"
                sx={{
                  color: "#94a3b8",
                  textDecoration: "none",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  transition: "color 0.2s",
                  "&:hover": {
                    color: "#3b82f6",
                  },
                }}
              >
                <i className="bi bi-question-circle-fill"></i> Support
              </Box>
              <Box
                component="a"
                href="/contact"
                sx={{
                  color: "#94a3b8",
                  textDecoration: "none",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  transition: "color 0.2s",
                  "&:hover": {
                    color: "#3b82f6",
                  },
                }}
              >
                <i className="bi bi-envelope-fill"></i> Contact
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;
