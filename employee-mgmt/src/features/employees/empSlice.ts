import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { addEmployee, deleteEmployee, fetchEmployees, getEmployee, updateEmployee } from "./empApi";
import type { Employee, EmployeesState } from "../../interfaces/employee.interface";


const employeesAdapter = createEntityAdapter<Employee>();

// const initialState: EmployeesState = {
//     list: [],
//     employee: null,
//     loading: false,
//     isDeleted: false
// };

const initialState: EmployeesState = employeesAdapter.getInitialState({
    employee: null, // To store a single employee
    loading: false,
    isDeleted: false,
});

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
                // state.list = action.payload;

                employeesAdapter.setAll(state, action.payload);
            })
            .addCase(addEmployee.fulfilled, (state, action) => {
                // state.list.push(action.payload);

                employeesAdapter.addOne(state, action.payload);
            })
            .addCase(getEmployee.fulfilled, (state, action) => {
                state.employee = action.payload;
            })
            .addCase(updateEmployee.fulfilled, (state, action) => {
                // const index = state.list.findIndex(e => e.id === action.payload.id);
                // if (index !== -1) state.list[index] = action.payload;

                employeesAdapter.updateOne(state, {
                    id: action.payload.id,
                    changes: action.payload
                });
            })
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                // state.isDeleted = action.payload;

                state.isDeleted = action.payload;
                if (action.payload === true) {
                    employeesAdapter.removeOne(state, action.meta.arg);
                }
            })
    },
});

export default employeesSlice.reducer;
