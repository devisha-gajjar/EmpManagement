import { useState } from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import MyDocuments from "./MyDocument";
import { ProfileDetails } from "./ProfileDetails";

export default function MyProfilePage() {
  const [value, setValue] = useState(0);

  return (
    <Paper elevation={1}>
      <Tabs
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Profile" />
        <Tab label="Documents" />
      </Tabs>

      <Box p={2}>
        {value === 0 && <ProfileDetails />}
        {value === 1 && <MyDocuments />}
      </Box>
    </Paper>
  );
}
