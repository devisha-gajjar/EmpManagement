import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const fetchEmployees = createAsyncThunk(
    "employees/fetch",
    async () => {
        const res = await axiosClient.get("/employee");
        return res.data;
    }
);

export const addEmployee = createAsyncThunk(
    "employees/add",
    async (employeeData: any, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post("/employee/", employeeData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const getEmployee = createAsyncThunk(
    "employees/get",
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get(`/employee/${id}`)
            console.log("response", response)
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    }
)

export const updateEmployee = createAsyncThunk(
    "employees/update",
    async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.put(`/employee/${id}`, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const deleteEmployee = createAsyncThunk(
    "employee/delete",
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await axiosClient.delete(`/employee/${id}`);
            return response.data;
        }
        catch (err: any) {
            return rejectWithValue(err.response?.data);
        }
    }
)