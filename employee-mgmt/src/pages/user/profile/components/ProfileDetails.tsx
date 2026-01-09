import { useEffect, useState } from "react";
import { Box, TextField, MenuItem, Stack } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { Country, State, City } from "country-state-city";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { fetchGeoByIp } from "../../../../features/user/profile/locationApi";

export function ProfileDetails() {
  const dispatch = useAppDispatch();
  const geo = useAppSelector((s) => s.geo.geo);

  const countries = Country.getAllCountries();

  const [form, setForm] = useState({
    countryCode: "",
    stateCode: "",
    city: "",
    phone: "",
  });

  useEffect(() => {
    dispatch(fetchGeoByIp());
  }, [dispatch]);

  useEffect(() => {
    if (geo?.isoCode) {
      setForm((p) => ({
        ...p,
        countryCode: geo.isoCode,
      }));
    }
  }, [geo]);

  // States & cities
  const states = form.countryCode
    ? State.getStatesOfCountry(form.countryCode)
    : [];

  const cities = form.stateCode
    ? City.getCitiesOfState(form.countryCode, form.stateCode)
    : [];

  return (
    <Box p={2}>
      <Stack
        spacing={2}
        flexWrap="wrap"
        direction={{ xs: "column", md: "row" }}
      >
        {/* Country */}
        <Box flex={1} minWidth={250}>
          <TextField
            select
            fullWidth
            label="Country"
            value={form.countryCode}
            onChange={(e) =>
              setForm({
                countryCode: e.target.value,
                stateCode: "",
                city: "",
                phone: "",
              })
            }
            required
          >
            {countries.map((c) => (
              <MenuItem key={c.isoCode} value={c.isoCode}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* State */}
        {states.length > 0 && (
          <Box flex={1} minWidth={250}>
            <TextField
              select
              fullWidth
              label="State"
              value={form.stateCode}
              onChange={(e) =>
                setForm({ ...form, stateCode: e.target.value, city: "" })
              }
              required
            >
              {states.map((s) => (
                <MenuItem key={s.isoCode} value={s.isoCode}>
                  {s.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        )}

        {/* City */}
        {cities.length > 0 && (
          <Box flex={1} minWidth={250}>
            <TextField
              select
              fullWidth
              label="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              required
            >
              {cities.map((c) => (
                <MenuItem key={c.name} value={c.name}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        )}

        {/* Phone */}
        <Box flex={1} minWidth={250}>
          <PhoneInput
            country={form.countryCode.toLowerCase()}
            value={form.phone}
            onChange={(phone) => setForm({ ...form, phone })}
            inputStyle={{ width: "100%" }}
          />
        </Box>
      </Stack>
    </Box>
  );
}
