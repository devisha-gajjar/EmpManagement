import { Box } from "@mui/material";
import { fetchGeoByIp } from "../../../../features/user/profile/locationApi";
import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import DynamicFormComponent from "../../../../components/shared/form/CommonForm";
import { userFormConfig } from "../configs/profile.config";

interface ProfileFormValues {
  country: string;
  phone: string;
}

export function ProfileDetails() {
  const dispatch = useAppDispatch();
  const geo = useAppSelector((s) => s.geo.geo);

  useEffect(() => {
    dispatch(fetchGeoByIp());
  }, [dispatch]);

  const defaultValues = useMemo<ProfileFormValues>(
    () => ({
      country: geo?.isoCode ?? "",
      phone: "",
    }),
    [geo?.isoCode]
  );

  const handleSubmit = (data: ProfileFormValues) => {
    console.log("Form submitted:", data);
    // call your update API here
  };

  const handleCancel = () => {
    console.log("Cancelled");
  };

  return (
    <Box p={2}>
      <DynamicFormComponent
        formConfig={userFormConfig}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel="Update Profile"
        cancleLabel="Reset"
      />
    </Box>
  );
}
