import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import type { UserDocument } from "../../../interfaces/userDocument.interface";

export const fetchUserDocument = createAsyncThunk<
    UserDocument[]
>("documents/fetchMyDocuments", async () => {
    const response = await axiosClient.get("/user-documents/my-documents");
    return response.data.data;
});


export const uploadUserDocuments = createAsyncThunk<
    UserDocument[],
    FormData
>("documents/upload", async (formData) => {
    const response = await axiosClient.post(
        "/user-documents/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data.data;
});
