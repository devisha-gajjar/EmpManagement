import type { ApiResponse } from "../../../interfaces/apiResponse.interface";
import axiosClient from "../../../api/axiosClient";
import type { TaskResponseDto, TaskDetailResponseDto, TaskCommentDto, TaskWorkLogDto, TaskTimelineDto } from "../../../interfaces/userTask.interface,";

/* =========================
   TASK LIST
========================= */
export const getUserTasksApi = async (): Promise<TaskResponseDto[]> => {
    const response = await axiosClient.get<ApiResponse<TaskResponseDto[]>>(
        "/user/tasks",
        { withCredentials: true }
    );

    return response.data.data;
};

/* =========================
   TASK DETAIL
========================= */
export const getTaskDetailApi = async (
    taskId: number
): Promise<TaskDetailResponseDto> => {
    const response = await axiosClient.get<
        ApiResponse<TaskDetailResponseDto>
    >(`/user/tasks/${taskId}`, {
        withCredentials: true,
    });

    return response.data.data;
};

/* =========================
   ADD COMMENT
========================= */
export const addTaskCommentApi = async (
    taskId: number,
    payload: { comment: string }
): Promise<TaskCommentDto> => {
    const response = await axiosClient.post<
        ApiResponse<TaskCommentDto>
    >(`/user/tasks/${taskId}/comments`, payload, {
        withCredentials: true,
    });

    return response.data.data;
};

/* =========================
   ADD WORK LOG
========================= */
export const addTaskWorkLogApi = async (
    taskId: number,
    payload: {
        hoursSpent: number;
        logDate: string;
        description?: string;
    }
): Promise<{ workLog: TaskWorkLogDto; totalHours: number }> => {
    const response = await axiosClient.post<
        ApiResponse<{ workLog: TaskWorkLogDto; totalHours: number }>
    >(`/user/tasks/${taskId}/worklogs`, payload, {
        withCredentials: true,
    });

    return response.data.data;
};

/* =========================
   UPDATE STATUS
========================= */
export const updateTaskStatusApi = async (
    taskId: number,
    payload: { status: string }
): Promise<TaskTimelineDto> => {
    const response = await axiosClient.patch<
        ApiResponse<TaskTimelineDto>
    >(`/user/tasks/${taskId}/status`, payload, {
        withCredentials: true,
    });

    return response.data.data;
};
