import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const fetchDepartments = createAsyncThunk(
    'departments/fetchDepartments',
    async () => {
        const response = await axiosClient.get('/Department');
        return response.data;
    }
);