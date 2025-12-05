import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";

export const fetchLeaves = createAsyncThunk(
    'leaves/fetchLeaves',
    async () => {
        const response = await axiosClient.get('/Leave/GetUserLeaveHistory');
        return response.data;
    }
);