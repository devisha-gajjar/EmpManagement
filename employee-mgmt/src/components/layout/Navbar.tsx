import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { getNavLinksByRole } from "../../utils/constant";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAppSelector } from "../../app/hooks";

export default function Navbar() {
  const role = useAppSelector((state) => state.auth.role);

  const NAV_LINKS = getNavLinksByRole(role as string);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenLogoutDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenLogoutDialog(false);
  };

  const handleLogout = () => {
    handleCloseDialog();
    dispatch(logout());
    navigate("/login");
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: "bold" }}
        >
          Employee Management
        </Typography>

        {/* <Box sx={{ display: { xs: "none", sm: "block" } }}>
          {NAV_LINKS.map((item) => (
            <Button
              key={item.name}
              color="inherit"
              component={Link}
              to={item.path}
              sx={{ textTransform: "none" }}
            >
              {item.name}
            </Button>
          ))}
        </Box> */}

        {/* <Button
          color="inherit"
          onClick={handleOpenDialog}
          endIcon={<LogoutIcon />}
          sx={{ textTransform: "none", ml: 2 }}
        >
          Logout
        </Button> */}
      </Toolbar>

      {/* --- Logout Confirmation Dialog --- */}
      <Dialog
        open={openLogoutDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Logout"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            color="primary"
            autoFocus
            variant="contained"
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}
