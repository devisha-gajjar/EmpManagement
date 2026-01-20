import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import type { LoginData, RegisterData } from "../../interfaces/login.interface";

export const login = createAsyncThunk(
    "auth/login",
    async (data: LoginData, thunkAPI) => {
        try {
            const response = await axiosClient.post("/auth/login", data);
            return response.data; // LoginResponse
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.Message || "Login failed"
            );
        }
    }
);


export const registerUser = createAsyncThunk(
    "auth/register",
    async (data: RegisterData, thunkAPI) => {
        try {
            // Remove confirmPassword 
            const { confirmPassword, ...dataToSend } = data;

            await axiosClient.post("/auth/register", dataToSend);
            return "Registration successful! Please log in.";
        } catch (err: any) {
            const errorMessage = err.response?.data?.Message || "Registration failed due to network or server error.";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

export const googleLogin = createAsyncThunk(
    "auth/googleLogin",
    async (idToken: string, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post(
                "/auth/google-login",
                { idToken }
            );

            return response.data.token as string;;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Google login failed"
            );
        }
    }
);

export const verify2FA = createAsyncThunk(
    "auth/verify2fa",
    async (data: { tempToken: string; code: string }, thunkAPI) => {
        try {
            const res = await axiosClient.post("/auth/verify-2fa", data);
            return res.data.accessToken;
        } catch {
            return thunkAPI.rejectWithValue("Invalid authentication code");
        }
    }
);


export const setup2FA = createAsyncThunk(
    "auth/setup2fa",
    async (_, thunkAPI) => {
        try {
            const res = await axiosClient.post("/auth/2fa/setup");
            return res.data; // { secret, qrCodeUri }
        } catch {
            return thunkAPI.rejectWithValue("Failed to setup 2FA");
        }
    }
);
