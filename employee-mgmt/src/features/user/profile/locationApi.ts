import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";


export const fetchGeoByIp = createAsyncThunk(
    "geo/fetchByIp",
    async () => {
        const res = await axiosClient.get("/geo/country");
        return res.data;
    }
);

export const sendCoordinatesToBE = (data: {
    latitude: number;
    longitude: number;
}) => {
    return axiosClient.post("/geo/coordinates", data);
};