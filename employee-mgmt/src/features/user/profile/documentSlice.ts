import { createSlice } from "@reduxjs/toolkit";
import { fetchUserDocument } from "./documentApi";
import type { UserDocumentState } from "../../../interfaces/userDocument.interface";

const initialState: UserDocumentState = {
    documents: [],
    loading: false,
    error: null,
};

const documentSlice = createSlice({
    name: "userDocuments",
    initialState,
    reducers: {
        clearDocuments: (state) => {
            state.documents = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserDocument.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserDocument.fulfilled, (state, action) => {
                state.loading = false;
                state.documents = action.payload;
            })
            .addCase(fetchUserDocument.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message || "Failed to fetch user documents";
            });
    },
});

export const { clearDocuments } = documentSlice.actions;
export default documentSlice.reducer;
