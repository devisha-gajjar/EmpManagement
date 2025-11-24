import { createSlice } from "@reduxjs/toolkit";
import { fetchEmployees } from "./empApi";

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
