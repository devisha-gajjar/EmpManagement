import { useDispatch, useSelector } from "react-redux";
import { Alert, Snackbar } from "@mui/material";
import { closeSnackbar } from "../../../features/shared/snackbarSlice";

export const SnackbarComponent = () => {
  const dispatch = useDispatch();
  const { isOpen, message, type } = useSelector((state: any) => state.snackbar);

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    dispatch(closeSnackbar());
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
