import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import type { UserDocument } from "../../../interfaces/userDocument.interface";

export const fetchUserDocument = createAsyncThunk<
    UserDocument[]
>("documents/fetchMyDocuments", async () => {
    const response = await axiosClient.get("/api/user-documents/my-documents");
    return response.data.data;
});
