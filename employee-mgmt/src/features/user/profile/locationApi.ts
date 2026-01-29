import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../api/axiosClient";
import { getBrowserLocation } from "../../../services/location/geoLocation.service";
import { mapIpGeoToModel, mapReverseGeoToModel, type GeoResponse, type IpGeoResponse, type ReverseGeoResponse } from "../../../interfaces/geoLocation.interface";

export const reverseGeocodeApi = async (data: {
    latitude: number;
    longitude: number;
}): Promise<ReverseGeoResponse> => {
    const res = await axiosClient.post("/geo/reverse", data);
    return res.data;
};

export const fetchGeoByIpApi = async (): Promise<IpGeoResponse> => {
    const res = await axiosClient.get("/geo/country");
    return res.data;
};

export const sendCoordinatesToBE = async (data: {
    latitude: number;
    longitude: number;
}): Promise<GeoResponse> => {
    const res = await axiosClient.post("/geo/coordinates", data);
    return res.data;
};

export const fetchUserGeo = createAsyncThunk<GeoResponse | null>(
    "geo/fetchUserGeo",
    async (_, { rejectWithValue }) => {
        try {
            // 1️⃣ Browser GPS
            const location = await getBrowserLocation();

            const gpsRes: ReverseGeoResponse =
                await reverseGeocodeApi({
                    latitude: location.latitude,
                    longitude: location.longitude,
                });

            return mapReverseGeoToModel(gpsRes);
        } catch {
            try {
                // 2️⃣ IP fallback
                const ipRes: IpGeoResponse =
                    await fetchGeoByIpApi();

                return mapIpGeoToModel(ipRes);
            } catch {
                return rejectWithValue(null);
            }
        }
    }
);
