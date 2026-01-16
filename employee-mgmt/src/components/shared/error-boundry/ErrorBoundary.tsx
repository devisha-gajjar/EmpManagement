import React, { Component, type ReactNode } from "react";
import { Box, Typography, Button } from "@mui/material";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service (Sentry, LogRocket, etc.)
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleReload = () => {
    globalThis.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
        >
          <Typography variant="h5" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            An unexpected error occurred. Please try again.
          </Typography>
          <Button variant="contained" onClick={this.handleReload}>
            Reload Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
