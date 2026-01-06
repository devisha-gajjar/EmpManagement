import { createTheme } from "@mui/material/styles";

export const getMuiTheme = (mode: "light" | "dark") =>
    createTheme({
        palette: {
            mode,
            background: {
                default: mode === "dark" ? "#0f172a" : "#ffffff",
                paper: mode === "dark" ? "#1e293b" : "#ffffff",
            },
        },
    });
