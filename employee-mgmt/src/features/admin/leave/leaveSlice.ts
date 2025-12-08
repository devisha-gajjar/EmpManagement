import { createSlice } from "@reduxjs/toolkit";
import type { LeaveListSlice } from "../../../interfaces/leave.interface";
import { fetchLeavesList } from "./leaveApi";

const initialState: LeaveListSlice = {
    leaves: [],
    loading: false,
    error: null,
}

const leaveListSlice = createSlice({
    name: "leaveList",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeavesList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLeavesList.fulfilled, (state, action) => {
                state.loading = false;
                state.leaves = action.payload;
            })
            .addCase(fetchLeavesList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
})

export default leaveListSlice.reducer;