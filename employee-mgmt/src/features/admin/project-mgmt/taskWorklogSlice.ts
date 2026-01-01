import { createSlice } from "@reduxjs/toolkit";
import { fetchTaskWorkLogs } from "./taskWorklogApi";
import type { TaskWorkLogListResponse } from "../../../interfaces/taskWorkLog.interface";

interface TaskWorkLogsState {
    data: TaskWorkLogListResponse | null;
    loading: boolean;
}

const initialState: TaskWorkLogsState = {
    data: null,
    loading: false,
};

const taskWorkLogsSlice = createSlice({
    name: "taskWorkLogs",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTaskWorkLogs.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTaskWorkLogs.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchTaskWorkLogs.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default taskWorkLogsSlice.reducer;