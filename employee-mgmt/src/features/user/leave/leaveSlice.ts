import { createSlice } from '@reduxjs/toolkit';
import { createLeave, fetchLeaves } from './leaveApi';
import type { LeaveSlice } from '../../../interfaces/leave.interface';

const initialState: LeaveSlice = {
    leaves: [],
    loading: false,
    error: null,
}

const leaveSlice = createSlice({
    name: 'leaves',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeaves.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLeaves.fulfilled, (state, action) => {
                state.loading = false;
                state.leaves = action.payload;
            })
            .addCase(fetchLeaves.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Create Leave
            .addCase(createLeave.pending, (state) => {
                state.loading = true;
            })
            .addCase(createLeave.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(createLeave.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default leaveSlice.reducer;
