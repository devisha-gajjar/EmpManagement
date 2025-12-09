import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";

export const fetchLeavesList = createAsyncThunk(
    'leaves/fetchLeaves',
    async (_, thunkAPI) => {
        try {
            const response = await axiosClient.get("/Leave/GetLeaveList");
            return response.data;
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || 'Failed to load leave list data';
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);
