import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import type { LoginData, RegisterData } from "./interfaces/login.interface";

export const login = createAsyncThunk(
    "auth/login",
    async (data: LoginData, thunkAPI) => {
        try {
            const response = await axiosClient.post("/auth/login", data);
            return response.data.token as string;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Login failed due to network or server error.";
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