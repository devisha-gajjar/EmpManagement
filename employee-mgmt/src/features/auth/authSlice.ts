import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,
    error: null,
};

export const login = createAsyncThunk(
    "auth/login",
    async (data: { usernameOrEmail: string; password: string }, thunkAPI) => {
        try {
            const res = await axiosClient.post("/auth/login", data);
            return res.data.token;
        } catch (err) {
            return thunkAPI.rejectWithValue("Invalid credentials");
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/register",
    async (data: any, thunkAPI) => {
        try {
            await axiosClient.post("/auth/register", data);
        } catch (err) {
            return thunkAPI.rejectWithValue("Registration failed");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload;
                state.isAuthenticated = true;
                localStorage.setItem("token", action.payload as string);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
