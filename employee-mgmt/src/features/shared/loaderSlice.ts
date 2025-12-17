// src/features/shared/loaderSlice.ts

import { createSlice } from '@reduxjs/toolkit';

interface LoaderState {
    isLoading: boolean;
    requestCount: number; // Track multiple requests
}

const initialState: LoaderState = {
    isLoading: false,
    requestCount: 0,
};

const loaderSlice = createSlice({
    name: 'loader',
    initialState,
    reducers: {
        showLoader: (state) => {
            state.requestCount += 1;
            console.log("show loader req", state.requestCount)
            if (state.requestCount > 0) {
                state.isLoading = true;  // Show loader if any request is ongoing
            }
        },
        hideLoader: (state) => {
            state.requestCount = Math.max(0, state.requestCount - 1);
            // Hide loader if no requests are pending
            if (state.requestCount === 0) {
                state.isLoading = false;
            }
        },
    },
});

export const { showLoader, hideLoader } = loaderSlice.actions;
export default loaderSlice.reducer;
