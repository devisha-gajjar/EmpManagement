import { createSlice } from "@reduxjs/toolkit";
import type { DepartmentState } from "../../interfaces/department.interface";
import { fetchDepartments } from "./departmentApi";

const initialState: DepartmentState = {
    departments: [],
    loading: false,
    error: null,
};

const deplartmnetSlice = createSlice({
    name: "department",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDepartments.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.loading = false;
                state.departments = action.payload;
                state.error = null;
            })
            .addCase(fetchDepartments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch Departments';
            })
    }
})

export default deplartmnetSlice.reducer;