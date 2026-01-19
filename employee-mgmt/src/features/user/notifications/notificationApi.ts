import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";

export const fetchNotificationsByUser = createAsyncThunk(
    "notifications/fetchByUser",
    async (_, thunkAPI) => {
        try {
            const response = await axiosClient.get(
                `/Notification/user`
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

export const fetchUnreadCount = createAsyncThunk(
    "notifications/fetchUnreadCount",
    async (_, thunkAPI) => {
        try {
            const response = await axiosClient.get(`/Notification/unread-count`);
            return response.data;
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || "Failed to load unread count";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

export const fetchNavbarNotifications = createAsyncThunk(
    "notifications/fetchNavbar",
    async (_, thunkAPI) => {
        try {
            const response = await axiosClient.get(
                "/Notification/navbar"
            );
            return response.data;
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || "Failed to load navbar notifications";
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

export const deleteNotification = createAsyncThunk(
    "notifications/delete",
    async (id: number, thunkAPI) => {
        try {
            await axiosClient.delete(`/Notification/${id}`);
            return id;
        } catch {
            return thunkAPI.rejectWithValue("Failed to delete notification");
        }
    }
);
