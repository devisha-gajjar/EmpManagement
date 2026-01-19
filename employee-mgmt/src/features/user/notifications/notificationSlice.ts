import { createSlice } from "@reduxjs/toolkit";
import { deleteNotification, fetchNavbarNotifications, fetchNotificationsByUser, fetchUnreadCount, markAllNotificationsAsRead, markNotificationAsRead } from "./notificationApi";
import type { NotificationList } from "../../../interfaces/notification.interface";

interface NotificationState {
    list: NotificationList[];
    navbarList: NotificationList[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: NotificationState = {
    list: [],
    navbarList: [],
    unreadCount: 0,
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

                // Full list
                const index = state.list.findIndex(
                    n => n.notificationId === updated.notificationId
                );
                if (index !== -1) {
                    state.list[index].isRead = true;
                }

                // Navbar list
                const navIndex = state.navbarList.findIndex(
                    n => n.notificationId === updated.notificationId
                );
                if (navIndex !== -1) {
                    state.navbarList[navIndex].isRead = true;
                }

                state.unreadCount = Math.max(0, state.unreadCount - 1);
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
            })

            // unread notification count 
            .addCase(fetchUnreadCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload;
            })

            // notification list for the navbar
            .addCase(fetchNavbarNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNavbarNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.navbarList = action.payload;
            })
            .addCase(fetchNavbarNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // delete notification from navbar 
            .addCase(deleteNotification.fulfilled, (state, action) => {
                state.list = state.list.filter(n => n.notificationId !== action.payload);
                state.navbarList = state.navbarList.filter(n => n.notificationId !== action.payload);
            })
            ;
    },
});

export default notificationSlice.reducer;
