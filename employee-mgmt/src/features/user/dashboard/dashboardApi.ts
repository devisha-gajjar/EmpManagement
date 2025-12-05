import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";

export const fetchDashboardData = createAsyncThunk(
    'userDashboard/fetchDashboardData',
    async (_, thunkAPI) => {
        try {
            const response = await axiosClient.get(`user/dashboard`);
            return response.data;
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || 'Failed to load dashboard data';
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);
