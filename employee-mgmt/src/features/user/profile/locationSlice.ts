import { createSlice } from "@reduxjs/toolkit";
import { fetchUserGeo } from "./locationApi";
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
        builder
            // .addCase(fetchGeoByIpApi.fulfilled, (state, action) => {
            //     state.geo = action.payload;
            // })
            .addCase(fetchUserGeo.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserGeo.fulfilled, (state, action) => {
                state.loading = false;
                state.geo = action.payload;
            })
            .addCase(fetchUserGeo.rejected, (state) => {
                state.loading = false;
                state.geo = null;
            });
    },
});

export default geoSlice.reducer;
