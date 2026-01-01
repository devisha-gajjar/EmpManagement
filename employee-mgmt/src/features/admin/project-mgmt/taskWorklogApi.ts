import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";

export const fetchTaskWorkLogs = createAsyncThunk(
    "taskWorkLogs/fetchByTaskId",
    async (taskId: number) => {
        const res = await axiosClient.get(`/worklog/${taskId}`);
        return res.data.data;
    }
);
