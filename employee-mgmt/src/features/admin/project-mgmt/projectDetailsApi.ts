import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import type { Project, Task } from "../../../interfaces/project.interface";
import type { ApiResponse } from "../../../interfaces/apiResponse.interface";

export const fetchProjectById = createAsyncThunk<Project, number>(
    "projectDetails/fetchProjectById",
    async (projectId) => {
        const response = await axiosClient.get<ApiResponse<Project>>(
            `/Projects/${projectId}`
        );
        return response.data.data;
    }
);

export const fetchProjectTasks = createAsyncThunk<Task[], number>(
    "projectDetails/fetchProjectTasks",
    async (projectId) => {
        const response = await axiosClient.get<ApiResponse<Task[]>>(
            `/Projects/${projectId}/tasks`
        );
        return response.data.data;
    }
);

export const updateTaskStatus = createAsyncThunk<
    { taskId: number; status: string },
    { taskId: number; status: string }
>("projectDetails/updateTaskStatus", async ({ taskId, status }) => {
    await axiosClient.put(`/Tasks/${taskId}/status`, { status });
    return { taskId, status };
});
