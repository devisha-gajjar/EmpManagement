import { createSlice } from '@reduxjs/toolkit';
import { fetchDashboardData } from './dashboardApi';
import type { DashboardState } from '../../../interfaces/dashboard.interface';

const initialState: DashboardState = {
    dashboard: null,
    loading: false,
    error: null,
};

const userDashboardSlice = createSlice({
    name: 'userDashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                state.dashboard = action.payload;
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default userDashboardSlice.reducer;
