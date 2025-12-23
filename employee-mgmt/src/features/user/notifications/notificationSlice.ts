import { createSlice } from "@reduxjs/toolkit";
import { fetchNotificationsByUser } from "./notificationApi";
import type { NotificationList } from "../../../interfaces/notification.interface";

interface NotificationState {
    list: NotificationList[];
    loading: boolean;
    error: string | null;
}

const initialState: NotificationState = {
    list: [],
    loading: false,
    error: null,
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotificationsByUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotificationsByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchNotificationsByUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default notificationSlice.reducer;
