import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const fetchEmployees = createAsyncThunk(
    "employees/fetch",
    async () => {
        const res = await axiosClient.get("/employee");
        return res.data;
    }
);