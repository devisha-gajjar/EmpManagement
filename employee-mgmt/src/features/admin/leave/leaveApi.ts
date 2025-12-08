import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";

export const fetchLeavesList = createAsyncThunk(
    'leaves/fetchLeaves',
    async () => {
        const response = await axiosClient.get("/Leave/GetLeaveList");
        return response.data;
    }
);
