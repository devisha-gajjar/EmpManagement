import { createSlice } from "@reduxjs/toolkit";
import { fetchGeoByIp } from "./locationApi";
import type { GeoResponse } from "../../../interfaces/geoLocation.interface";

interface GeoState {
    geo: GeoResponse | null;
    loading: boolean;
}

const initialState: GeoState = {
    geo: null,
    loading: false,
};

const geoSlice = createSlice({
    name: "geo",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchGeoByIp.fulfilled, (state, action) => {
            state.geo = action.payload;
        });
    },
});

export default geoSlice.reducer;
