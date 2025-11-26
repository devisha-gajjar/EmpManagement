import { createSlice } from "@reduxjs/toolkit";
import { addEmployee, deleteEmployee, fetchEmployees, getEmployee, updateEmployee } from "./empApi";
import type { EmployeesState } from "../../interfaces/employee.interface";

const initialState: EmployeesState = {
    list: [],
    employee: null,
    loading: false,
    isDeleted: false
};

const employeesSlice = createSlice({
    name: "employees",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployees.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(addEmployee.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(getEmployee.fulfilled, (state, action) => {
                state.employee = action.payload;
            })
            .addCase(updateEmployee.fulfilled, (state, action) => {
                const index = state.list.findIndex(e => e.id === action.payload.id);
                if (index !== -1) state.list[index] = action.payload;
            })
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.isDeleted = action.payload;
            })
    },
});

export default employeesSlice.reducer;
