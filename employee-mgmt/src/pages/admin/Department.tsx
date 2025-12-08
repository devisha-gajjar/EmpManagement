import {
  Alert,
  Box,
  CircularProgress,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useEffect } from "react";
import { useAppSelector, useSnackbar, useAppDispatch } from "../../app/hooks";
import { fetchDepartments } from "../../features/admin/department/departmentApi";

function Department() {
  const { departments, loading, error } = useAppSelector(
    (state) => state.department
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const snackbar = useSnackbar();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      snackbar.error("Unauthorized Access!");
      return;
    }
    dispatch(fetchDepartments());
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="60vh"
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading departments...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={4}>
        <Alert severity="error">Error fetching departments: {error}</Alert>
      </Box>
    );
  }

  return (
    <Box m={4}>
      <Typography variant="h4" mb={3}>
        Department List
      </Typography>

      {departments.length === 0 ? (
        <Typography>No departments found.</Typography>
      ) : (
        <List>
          {departments.map((d) => (
            <ListItem
              key={d.id}
              component={Paper}
              sx={{
                mb: 2,
                p: 2,
                boxShadow: 2,
                borderRadius: 2,
                "&:hover": { boxShadow: 4 },
              }}
            >
              <ListItemText primary={d.name} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export { Department };
