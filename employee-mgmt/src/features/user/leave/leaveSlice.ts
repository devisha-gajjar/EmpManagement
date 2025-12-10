import { createSlice } from '@reduxjs/toolkit';
import { deleteLeave, fetchLeaves, fetchLeaveToEdit } from './leaveApi';
import type { LeaveSlice } from '../../../interfaces/leave.interface';

const initialState: LeaveSlice = {
    leaves: [],
    loading: false,
    error: null,
    leaveEdit: null,
    isDeleted: false
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
            .addCase(fetchLeaveToEdit.fulfilled, (state, action) => {
                state.leaveEdit = action.payload;
            })
            .addCase(deleteLeave.fulfilled, (state, action) => {
                state.isDeleted = action.payload;
            })
    }
});

export default leaveSlice.reducer;
