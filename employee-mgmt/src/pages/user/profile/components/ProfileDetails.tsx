import { Box } from "@mui/material";
import { fetchUserGeo } from "../../../../features/user/profile/locationApi";
import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import DynamicFormComponent from "../../../../components/shared/form/CommonForm";
import { userFormConfig } from "../configs/profile.config";
import { resolveCountryIso } from "../../../../interfaces/geoLocation.interface";

interface ProfileFormValues {
  country: string;
  phone: string;
}

export function ProfileDetails() {
  const dispatch = useAppDispatch();
  const geo = useAppSelector((s) => s.geo.geo);
  console.log("Geo" + geo);
  const loading = useAppSelector((s) => s.geo.loading);

  useEffect(() => {
    dispatch(fetchUserGeo());
  }, [dispatch]);

  const defaultValues = useMemo<ProfileFormValues>(
    () => ({
      country: resolveCountryIso(geo),
      phone: "",
    }),
    [geo]
  );

  if (loading) {
    return <div>Loading location…</div>;
  }

  const handleSubmit = (data: ProfileFormValues) => {
    console.log("Form submitted:", data);
  };

  return (
    <Box p={2}>
      <DynamicFormComponent
        formConfig={userFormConfig}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        onCancel={() => {}}
        submitLabel="Update Profile"
        cancleLabel="Reset"
      />
    </Box>
  );
}
