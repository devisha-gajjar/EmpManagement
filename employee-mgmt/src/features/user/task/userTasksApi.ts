import axios from "axios";
import type { ApiResponse } from "../../../interfaces/apiResponse.interface";
import type { TaskResponseDto } from "../../../interfaces/userTask.interface,";
import axiosClient from "../../../api/axiosClient";

export const getUserTasksApi = async (): Promise<TaskResponseDto[]> => {
    const response = await axiosClient.get<ApiResponse<TaskResponseDto[]>>(
        "/user/tasks",
        {
            withCredentials: true, // cookies
        }
    );

    return response.data.data;
};
