import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const fetchEmployees = createAsyncThunk(
    "employees/fetch",
    async () => {
        const res = await axiosClient.get("/employee");
        return res.data;
    }
);

const employeesSlice = createSlice({
    name: "employees",
    initialState: { list: [], loading: false },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchEmployees.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchEmployees.fulfilled, (state, action) => {
            state.loading = false;
            state.list = action.payload;
        });
    },
});

export default employeesSlice.reducer;
