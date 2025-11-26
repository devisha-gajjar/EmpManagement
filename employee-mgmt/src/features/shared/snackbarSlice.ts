import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SnackbarState } from '../../interfaces/snackbar.interface';
import type { SnackbarType } from '../../types/type';

const initialState: SnackbarState = {
    isOpen: false,
    message: '',
    type: 'info',
};

export const snackbarSlice = createSlice({
    name: 'snackbar',
    initialState,
    reducers: {
        openSnackbar: (state, action: PayloadAction<{ message: string; type: SnackbarType }>) => {
            state.isOpen = true;
            state.message = action.payload.message;
            state.type = action.payload.type;
        },
        closeSnackbar: (state) => {
            state.isOpen = false;
        },
    },
});

export const { openSnackbar, closeSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;