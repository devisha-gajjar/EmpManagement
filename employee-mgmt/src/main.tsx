import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import GlobalLoader from "./components/shared/loader/GlobalLoader";
import { injectStore } from "./api/axiosClient";
import ErrorBoundary from "./components/shared/error-boundry/ErrorBoundary";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getMuiTheme } from "./muiTheme";
import { useAppSelector } from "./app/hooks";
import { useEffect } from "react";
import { environment } from "./environment/environment.dev";
import { GoogleOAuthProvider } from "@react-oauth/google";

injectStore(store);

function Root() {
  const mode = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  return (
    <ThemeProvider theme={getMuiTheme(mode)}>
      <CssBaseline />
      <ErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={environment.REACT_APP_GOOGLE_CLIENT_ID}>
      <Root />
    </GoogleOAuthProvider>
  </Provider>
);
