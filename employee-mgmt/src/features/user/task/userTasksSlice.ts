import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getTaskDetailApi, getUserTasksApi } from "./userTasksApi";
import type { TaskResponseDto } from "../../../interfaces/userTask.interface,";

interface UserTasksState {
    tasks: TaskResponseDto[];
    selectedTask: any,
    loading: boolean;
    error: string | null;
}

const initialState: UserTasksState = {
    tasks: [],
    selectedTask: null,
    loading: false,
    error: null,
};

/**
 * Async Thunk
 */
export const fetchUserTasks = createAsyncThunk<
    TaskResponseDto[],
    void,
    { rejectValue: string }
>("userTasks/fetchUserTasks", async (_, { rejectWithValue }) => {
    try {
        return await getUserTasksApi();
    } catch (error: any) {
        return rejectWithValue(
            error?.response?.data?.message || "Failed to fetch tasks"
        );
    }
});

export const fetchTaskDetail = createAsyncThunk<
    any,
    number,
    { rejectValue: string }
>("userTasks/fetchTaskDetail", async (taskId, { rejectWithValue }) => {
    try {
        console.log("Value fetche");
        return await getTaskDetailApi(taskId);
    } catch (error: any) {
        return rejectWithValue("Failed to fetch task detail");
    }
});

const userTasksSlice = createSlice({
    name: "userTasks",
    initialState,
    reducers: {
        clearUserTasks: (state) => {
            state.tasks = [];
            state.selectedTask = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchUserTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Something went wrong";
            })
            .addCase(fetchTaskDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTaskDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedTask = action.payload;
            })
            .addCase(fetchTaskDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Something went wrong";
            });
    },
});

export const { clearUserTasks } = userTasksSlice.actions;
export default userTasksSlice.reducer;
