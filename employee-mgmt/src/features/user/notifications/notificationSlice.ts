import { createSlice } from "@reduxjs/toolkit";
import { fetchNotificationsByUser, markAllNotificationsAsRead, markNotificationAsRead } from "./notificationApi";
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
            })
            // Mark single as read
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.list.findIndex(
                    (n) => n.notificationId === updated.notificationId
                );

                if (index !== -1) {
                    state.list[index].isRead = true;
                }
            })

            // Mark all / selected as read
            .addCase(markAllNotificationsAsRead.fulfilled, (state, action) => {
                const { notificationIds } = action.payload;

                state.list.forEach((n) => {
                    if (!n.isRead && (notificationIds == null ||
                        notificationIds.includes(n.notificationId))) {
                        n.isRead = true;
                    }
                });
            });
    },
});

export default notificationSlice.reducer;
