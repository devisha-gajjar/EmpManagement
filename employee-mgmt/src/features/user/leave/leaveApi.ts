import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";

export const fetchLeaves = createAsyncThunk(
    'leaves/fetchLeaves',
    async () => {
        const response = await axiosClient.get('/Leave/GetUserLeaveHistory');
        return response.data;
    }
);

export const fetchLeaveToEdit = createAsyncThunk(
    'leaves/fetchLeaveToEdit',
    async (id: number) => {
        const response = await axiosClient.get(`/Leave/${id}`);
        return response.data;
    }
)

export const deleteLeave = createAsyncThunk(
    'leaves/deleteLeave',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await axiosClient.delete(`/Leave/${id}`);
            return response.data;
        }
        catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
)