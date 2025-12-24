import { createSlice } from "@reduxjs/toolkit";
import type { ProjectDetailsState } from "../../../interfaces/project.interface";
import { fetchProjectById, fetchProjectTasks, updateTaskStatus } from "./projectDetailsApi";

const initialState: ProjectDetailsState = {
    project: null,
    tasks: [],
    loading: false,
    error: null,
};

const projectDetailsSlice = createSlice({
    name: "projectDetails",
    initialState,
    reducers: {
        clearProjectDetails: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            /* Fetch Project */
            .addCase(fetchProjectById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProjectById.fulfilled, (state, action) => {
                state.project = action.payload;
                state.loading = false;
            })
            .addCase(fetchProjectById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to load project";
            })

            /* Fetch Tasks */
            .addCase(fetchProjectTasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProjectTasks.fulfilled, (state, action) => {
                state.tasks = action.payload;
                state.loading = false;
            })
            .addCase(fetchProjectTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to load tasks";
            })

            /* Update Task Status (Optimistic) */
            .addCase(updateTaskStatus.fulfilled, (state, action) => {
                const task = state.tasks.find(
                    (t) => t.task_id === action.payload.taskId
                );
                if (task) {
                    task.status = action.payload.status;
                }
            });
    },
});

export const { clearProjectDetails } = projectDetailsSlice.actions;
export default projectDetailsSlice.reducer;
