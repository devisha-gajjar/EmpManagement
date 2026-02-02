import { createSlice } from "@reduxjs/toolkit";
import { googleLogin, login, registerUser, verify2FA } from "./authApi";
import { ACCESS_TOKEN_KEY, roleClaimKey, TEMP_TOKEN_KEY, userIdClaimKey, userNameClaimKey } from "../../utils/constant";

export interface AuthState {
    token: string | null;
    tempToken: string | null;
    loginStep: "success" | "require_2fa" | "require_2fa_setup" | null;
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
        return payload[userNameClaimKey]?.toLowerCase() || null;
    } catch {
        return null;
    }
};

const initialToken = localStorage.getItem(ACCESS_TOKEN_KEY);

const initialState: AuthState = {
    token: initialToken,
    tempToken: null,
    loginStep: null,
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
            state.userId = null;
            state.userName = null;
            state.isAuthenticated = false;
            state.error = null;
            state.registerSuccess = null;
            state.tempToken = null;
            state.loginStep = null;
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(TEMP_TOKEN_KEY);
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
        // New action to set credentials after token refresh
        setCredentials(state, action) {
            const { accessToken } = action.payload;
            state.token = accessToken;
            state.isAuthenticated = true;
            state.role = getRoleFromToken(accessToken);
            state.userId = getUserIdFromToken(accessToken);
            state.userName = getUserNameFromToken(accessToken);
            localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
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
                state.error = null;

                const { step, accessToken, tempToken } = action.payload;

                if (step === 1) {
                    // SUCCESS
                    state.token = accessToken;
                    state.isAuthenticated = true;
                    state.loginStep = "success";
                    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
                    state.role = getRoleFromToken(accessToken);
                    state.userId = getUserIdFromToken(accessToken);
                    state.userName = getUserNameFromToken(accessToken);
                }

                if (step === 2) {
                    // REQUIRE OTP
                    state.tempToken = tempToken;
                    state.loginStep = "require_2fa";
                }

                if (step === 3) {
                    // REQUIRE SETUP
                    state.tempToken = tempToken;
                    localStorage.setItem(TEMP_TOKEN_KEY, tempToken);
                    state.loginStep = "require_2fa_setup";
                }
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
            })

            // ---- sign in with google case ----
            .addCase(googleLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload;
                state.isAuthenticated = true;
                state.role = getRoleFromToken(action.payload);
                state.userId = getUserIdFromToken(action.payload);
                state.userName = getUserNameFromToken(action.payload);
                localStorage.setItem(ACCESS_TOKEN_KEY, action.payload);
            })
            .addCase(googleLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // ---- verify the 2FA ------
            .addCase(verify2FA.fulfilled, (state, action) => {
                state.token = action.payload;
                state.isAuthenticated = true;
                state.loginStep = "success";
                localStorage.removeItem(TEMP_TOKEN_KEY);
                localStorage.setItem(ACCESS_TOKEN_KEY, action.payload);
                state.role = getRoleFromToken(action.payload);
                state.userId = getUserIdFromToken(action.payload);
                state.userName = getUserNameFromToken(action.payload);
            });
    },
});

export const {
    logout,
    clearAuthStatus,
    setReturnUrl,
    clearReturnUrl,
    setCredentials
} = authSlice.actions;

export default authSlice.reducer;