import { createTheme } from "@mui/material/styles";

export const getMuiTheme = (mode: "light" | "dark") =>
    createTheme({
        palette: {
            mode,

            background: {
                default: mode === "dark" ? "#010E1D" : "#F4F7FB",
                paper: mode === "dark" ? "#011A33" : "#FFFFFF",
            },

            divider: mode === "dark" ? "#1F4D7A" : "#E2E8F0",

            text: {
                primary: mode === "dark" ? "#EAF1F8" : "#022A52",
                secondary: mode === "dark" ? "#B7C7DB" : "#334E68",
                disabled: mode === "dark" ? "#7D93AF" : "#9AAAC0",
            },

            action: {
                hover: mode === "dark"
                    ? "rgba(255, 255, 255, 0.06)"
                    : "rgba(2, 42, 82, 0.04)",

                selected: mode === "dark"
                    ? "rgba(74, 144, 226, 0.18)"
                    : "rgba(74, 144, 226, 0.12)",

                active: mode === "dark" ? "#4A90E2" : "#022A52",
            },
        },
    });
