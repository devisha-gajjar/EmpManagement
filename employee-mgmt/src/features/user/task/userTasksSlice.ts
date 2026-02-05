import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addTaskCommentApi, addTaskWorkLogApi, getTaskDetailApi, getUserTasksApi, updateTaskStatusApi } from "./userTasksApi";
import type { TaskCommentDto, TaskResponseDto, TaskTimelineDto, TaskWorkLogDto } from "../../../interfaces/userTask.interface,";

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
        return rejectWithValue(error?.response?.data?.message || "Failed to fetch task detail");
    }
});

export const addTaskComment = createAsyncThunk<
    TaskCommentDto,
    { taskId: number; comment: string },
    { rejectValue: string }
>("userTasks/addTaskComment", async ({ taskId, comment }, { rejectWithValue }) => {
    try {
        return await addTaskCommentApi(taskId, { comment });
    } catch (error: any) {
        return rejectWithValue(
            error?.response?.data?.message || "Failed to add comment"
        );
    }
});

export const addTaskWorkLog = createAsyncThunk<
    { workLog: TaskWorkLogDto; totalHours: number },
    {
        taskId: number;
        hoursSpent: number;
        logDate: string;
        description?: string;
    },
    { rejectValue: string }
>(
    "userTasks/addTaskWorkLog",
    async ({ taskId, ...payload }, { rejectWithValue }) => {
        try {
            return await addTaskWorkLogApi(taskId, payload);
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to add work log"
            );
        }
    }
);

export const updateTaskStatus = createAsyncThunk<
    TaskTimelineDto,
    { taskId: number; status: string },
    { rejectValue: string }
>("userTasks/updateTaskStatus", async ({ taskId, status }, { rejectWithValue }) => {
    try {
        return await updateTaskStatusApi(taskId, { status });
    } catch (error: any) {
        return rejectWithValue(
            error?.response?.data?.message || "Failed to update status"
        );
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
            // FETCH TASKS
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
            // FETCH TASK DETAIL
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
            })
            // ADD COMMENT
            .addCase(addTaskComment.fulfilled, (state, action) => {
                state.selectedTask?.comments.unshift(action.payload);
            })
            // ADD WORK LOG
            .addCase(addTaskWorkLog.fulfilled, (state, action) => {
                if (!state.selectedTask) return;

                state.selectedTask.workLogs.unshift(action.payload.workLog);
                state.selectedTask.stats.totalLoggedHours =
                    action.payload.totalHours;
            })
            //  UPDATE STATUS
            .addCase(updateTaskStatus.fulfilled, (state, action) => {
                if (!state.selectedTask) return;

                state.selectedTask.timeline.unshift(action.payload);
                state.selectedTask.task.status = action.payload.newValue;
            });
    },
});

export const { clearUserTasks } = userTasksSlice.actions;
export default userTasksSlice.reducer;
