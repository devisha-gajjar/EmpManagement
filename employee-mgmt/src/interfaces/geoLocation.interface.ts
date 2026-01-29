import { Country } from "country-state-city";

export interface GeoResponse {
    source: "GPS" | "IP";
    country: string | null;
    countryCode: string | null;
    state: string | null;
    city: string | null;
    postalCode: string | null;
    latitude: number | null;
    longitude: number | null;
}

// Reverse geocode response
export interface ReverseGeoResponse {
    latitude: number;
    longitude: number;
    address: {
        displayAddress: string;
        road?: string | null;
        city?: string | null;
        state?: string | null;
        country?: string | null;
        postalCode?: string | null;
    };
}

// IP-based response
export interface IpGeoResponse {
    ip: string;
    country: string;
    isoCode: string;
    continent: string;
}

// GPS → Normalized
export const mapReverseGeoToModel = (
    data: ReverseGeoResponse
): GeoResponse => ({
    source: "GPS",
    country: data.address.country ?? null,
    countryCode: null, // reverse geo usually doesn't give ISO
    state: data.address.state ?? null,
    city: data.address.city ?? null,
    postalCode: data.address.postalCode ?? null,
    latitude: data.latitude,
    longitude: data.longitude,
});

// IP → Normalized
export const mapIpGeoToModel = (
    data: IpGeoResponse
): GeoResponse => ({
    source: "IP",
    country: data.country,
    countryCode: data.isoCode,
    state: null,
    city: null,
    postalCode: null,
    latitude: null,
    longitude: null,
});


export const resolveCountryIso = (
    geo: GeoResponse | null
): string => {
    if (!geo) return "";

    // IP-based (already ISO)
    if (geo.countryCode) return geo.countryCode;

    // GPS-based (name → ISO)
    if (geo.country) {
        const match = Country.getAllCountries().find(
            (c) => c.name.toLowerCase() === geo.country?.toLowerCase()
        );

        return match?.isoCode ?? "";
    }

    return "";
};