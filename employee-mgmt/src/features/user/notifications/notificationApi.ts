import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";

export const fetchNotificationsByUser = createAsyncThunk(
    "notifications/fetchByUser",
    async (userId: number, thunkAPI) => {
        try {
            const response = await axiosClient.get(
                `/Notification/user/${userId}`
            );
            return response.data;
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || "Failed to load notifications";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);
