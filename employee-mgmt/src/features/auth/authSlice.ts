import { createSlice } from "@reduxjs/toolkit";
import { login, registerUser } from "./authApi";

export interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    registerSuccess: string | null;
}

const initialState: AuthState = {
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),
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
            state.isAuthenticated = false;
            state.error = null;
            state.registerSuccess = null;
            localStorage.removeItem("token");
        },
        // Action to clear any previous errors or success messages
        clearAuthStatus(state) {
            state.error = null;
            state.registerSuccess = null;
        }
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

export const { logout, clearAuthStatus } = authSlice.actions;

export default authSlice.reducer;