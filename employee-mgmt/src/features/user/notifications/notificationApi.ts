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

export const markNotificationAsRead = createAsyncThunk(
    "notifications/markAsRead",
    async (notificationId: number, thunkAPI) => {
        try {
            const response = await axiosClient.put(
                `/Notification/${notificationId}/read`
            );
            return response.data;
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || "Failed to mark notification as read";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

export const markAllNotificationsAsRead = createAsyncThunk(
    "notifications/markAllAsRead",
    async (notificationIds: number[] | null, thunkAPI) => {
        try {
            const response = await axiosClient.put(
                `/Notification/read`,
                notificationIds
            );
            return {
                notificationIds,
                markedCount: response.data.markedCount,
            };
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || "Failed to mark notifications as read";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);
