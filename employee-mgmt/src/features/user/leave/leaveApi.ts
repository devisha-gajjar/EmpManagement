import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import type { CreateLeaveRequest } from "../../../interfaces/leave.interface";

export const fetchLeaves = createAsyncThunk(
    'leaves/fetchLeaves',
    async () => {
        const response = await axiosClient.get('/Leave/GetUserLeaveHistory');
        return response.data;
    }
);

export const createLeave = createAsyncThunk(
    "leaves/createLeave",
    async (payload: CreateLeaveRequest) => {
        const response = await axiosClient.post("/Leave/ApplyLeave", payload);
        return response.data;
    }
);