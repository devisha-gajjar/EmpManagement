import { createSlice } from "@reduxjs/toolkit";
import { login, registerUser } from "./authApi";
import { roleClaimKey, userIdClaimKey, userNameClaimKey } from "../../utils/constant";

export interface AuthState {
    token: string | null;
    role: string | null;
    userId: string | null;
    userName: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    registerSuccess: string | null;
    returnUrl: string | null;
}

const getRoleFromToken = (token: string | null): string | null => {
    try {
        if (!token) return null;
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload[roleClaimKey]?.toLowerCase() || null;
    } catch {
        return null;
    }
};

const getUserIdFromToken = (token: string | null): string | null => {
    try {
        if (!token) return null;
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload[userIdClaimKey]?.toLowerCase() || null;
    } catch {
        return null;
    }
};

const getUserNameFromToken = (token: string | null): string | null => {
    try {
        if (!token) return null;
        const payload = JSON.parse(atob(token.split(".")[1]));
        // console.log("username", payload[userNameClaimKey]?.toLowerCase())
        return payload[userNameClaimKey]?.toLowerCase() || null;
    } catch {
        return null;
    }
};

const initialToken = localStorage.getItem("token");

const initialState: AuthState = {
    token: initialToken,
    role: getRoleFromToken(initialToken),
    userId: getUserIdFromToken(initialToken),
    userName: getUserNameFromToken(initialToken),
    isAuthenticated: !!initialToken,
    returnUrl: null,
    loading: false,
    error: null,
    registerSuccess: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.token = null;
            state.role = null;
            state.isAuthenticated = false;
            state.error = null;
            state.registerSuccess = null;
            localStorage.removeItem("token");
        },
        // Action to clear any previous errors or success messages
        clearAuthStatus(state) {
            state.error = null;
            state.registerSuccess = null;
        },
        setReturnUrl(state, action) {
            state.returnUrl = action.payload;
        },

        clearReturnUrl(state) {
            state.returnUrl = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // --- Login Cases ---
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload;
                state.isAuthenticated = true;
                state.error = null;
                state.registerSuccess = null;
                state.role = getRoleFromToken(action.payload);
                localStorage.setItem("token", action.payload as string);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.registerSuccess = null;
            })
            // --- Register Cases ---
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.registerSuccess = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.registerSuccess = action.payload as string;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.registerSuccess = null;
            });
    },
});

export const {
    logout,
    clearAuthStatus,
    setReturnUrl,
    clearReturnUrl
} = authSlice.actions;

export default authSlice.reducer;