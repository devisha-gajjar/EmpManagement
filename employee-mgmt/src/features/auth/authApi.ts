import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import type { LoginData, RegisterData } from "../../interfaces/login.interface";

export const login = createAsyncThunk(
    "auth/login",
    async (data: LoginData, thunkAPI) => {
        try {
            const response = await axiosClient.post("/auth/login", data);
            return response.data.token as string;
        } catch (err: any) {
            console.log(err);
            const errorMessage = err.response?.data?.Message || "Login failed due to network or server error.";
            return thunkAPI.rejectWithValue(errorMessage);
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
            const errorMessage = err.response?.data?.message || "Registration failed due to network or server error.";
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