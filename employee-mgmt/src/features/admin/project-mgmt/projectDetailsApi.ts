import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import type { ProjectDetailsResponse, ProjectTask } from "../../../interfaces/project.interface";
import type { ApiResponse } from "../../../interfaces/apiResponse.interface";
import type { RootState } from "../../../app/store";

export const fetchProjectById = createAsyncThunk<ProjectDetailsResponse, number>(
    "projectDetails/fetchProjectById",
    async (projectId) => {
        const response = await axiosClient.get<ApiResponse<ProjectDetailsResponse>>(
            `/Projects/details/${projectId}`
        );
        return response.data.data;
    }
);

// export const fetchProjectTasks = createAsyncThunk<Task[], number>(
//     "projectDetails/fetchProjectTasks",
//     async (projectId) => {
//         const response = await axiosClient.get<ApiResponse<Task[]>>(
//             `/Projects/${projectId}/tasks`
//         );
//         return response.data.data;
//     }
// );

// Fetch single task (for editing)
export const fetchTaskById = createAsyncThunk<ProjectTask, number>(
    "projectDetails/fetchTaskById",
    async (taskId) => {
        const response = await axiosClient.get<ApiResponse<ProjectTask>>(`/tasks/${taskId}`);
        return response.data.data;
    }
);

// Delete a task
export const deleteTask = createAsyncThunk<number, number>(
    "projectDetails/deleteTask",
    async (taskId) => {
        await axiosClient.delete(`/tasks/${taskId}`);
        return taskId; // return deleted taskId to update state
    }
);

export const updateTaskStatus = createAsyncThunk<
    { taskId: number; status: string },
    { taskId: number; status: string },
    { state: RootState }
>(
    "projectDetails/updateTaskStatus",
    async ({ taskId, status }, { getState }) => {

        const task = getState().projectDetails.tasks.find(
            t => t.taskId === taskId
        );

        if (!task) throw new Error("Task not found");

        await axiosClient.post(`/tasks/save`, {
            taskId: task.taskId,
            projectId: task.projectId,
            userId: task.userId,
            taskName: task.taskName,
            description: task.description,
            startDate: task.startDate,
            dueDate: task.dueDate,
            priority: task.priority,
            status: status,
            estimatedHours: task.estimatedHours
        });

        return { taskId, status };
    }
);

