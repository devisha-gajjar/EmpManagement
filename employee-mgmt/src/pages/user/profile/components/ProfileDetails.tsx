import { Box } from "@mui/material";
import { fetchGeoByIp } from "../../../../features/user/profile/locationApi";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import DynamicFormComponent from "../../../../components/shared/form/CommonForm";
import { userFormConfig } from "../configs/profile.config";

export function ProfileDetails() {
  const dispatch = useAppDispatch();
  const geo = useAppSelector((s) => s.geo.geo);
  let defaultValues = {
    country: geo?.isoCode || "",
    phone: "",
  };

  useEffect(() => {
    dispatch(fetchGeoByIp());

    defaultValues = {
      country: geo?.isoCode || "",
      phone: "",
    };
  }, [dispatch]);

  const handleSubmit = (data: any) => {
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
