import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import type { CreateLeaveRequest } from "../../../interfaces/leave.interface";
import { leaveHubService } from "../../../services/signalR/leaveHub.service";

export const fetchLeaves = createAsyncThunk(
    'leaves/fetchLeaves',
    async () => {
        const response = await axiosClient.get('/Leave/GetUserLeaveHistory');
        return response.data;
    }
);