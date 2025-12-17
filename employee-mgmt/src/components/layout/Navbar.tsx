// import { useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   Box,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
// } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import { getNavLinksByRole } from "../../utils/constant";
// import { useDispatch } from "react-redux";
// import { logout } from "../../features/auth/authSlice";
// import LogoutIcon from "@mui/icons-material/Logout";
// import { useAppSelector } from "../../app/hooks";

// export default function Navbar() {
//   const role = useAppSelector((state) => state.auth.role);

//   const NAV_LINKS = getNavLinksByRole(role as string);

//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

//   const handleOpenDialog = () => {
//     setOpenLogoutDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenLogoutDialog(false);
//   };

//   const handleLogout = () => {
//     handleCloseDialog();
//     dispatch(logout());
//     navigate("/login");
//   };

//   return (
//     <AppBar position="fixed">
//       <Toolbar>
//         <Typography
//           variant="h6"
//           component="div"
//           sx={{ flexGrow: 1, fontWeight: "bold" }}
//         >
//           Employee Management
//         </Typography>

//         {/* <Box sx={{ display: { xs: "none", sm: "block" } }}>
//           {NAV_LINKS.map((item) => (
//             <Button
//               key={item.name}
//               color="inherit"
//               component={Link}
//               to={item.path}
//               sx={{ textTransform: "none" }}
//             >
//               {item.name}
//             </Button>
//           ))}
//         </Box> */}

//         {/* <Button
//           color="inherit"
//           onClick={handleOpenDialog}
//           endIcon={<LogoutIcon />}
//           sx={{ textTransform: "none", ml: 2 }}
//         >
//           Logout
//         </Button> */}
//       </Toolbar>

//       {/* --- Logout Confirmation Dialog --- */}
//       <Dialog
//         open={openLogoutDialog}
//         onClose={handleCloseDialog}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">{"Confirm Logout"}</DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             Are you sure you want to log out?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} color="primary">
//             Cancel
//           </Button>
//           <Button
//             onClick={handleLogout}
//             color="primary"
//             autoFocus
//             variant="contained"
//           >
//             Logout
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </AppBar>
//   );
// }

import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  Nav,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { useAppSelector } from "../../app/hooks";

export default function AppNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { role, userName } = useAppSelector((state) => state.auth);

  // Profile dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Logout modal
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    setOpenLogoutDialog(false);
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <Navbar
        fixed="top"
        className="px-3 bg-white border-bottom border-1 border-primary"
      >
        <NavbarBrand className="fw-bold">Employee Management</NavbarBrand>

        <Nav className="ms-auto" navbar>
          {/* Profile Dropdown */}
          <Dropdown nav isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle
              nav
              caret
              className="d-flex align-items-center gap-2"
            >
              {/* Avatar */}
              <div
                className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
                style={{ width: 32, height: 32, fontSize: 14 }}
              >
                {userName?.charAt(0).toUpperCase()}
              </div>

              {/* Name nd Role */}
              <div className="text-start lh-sm">
                <div className="fw-semibold">{userName}</div>
                <small className="text-muted">{role}</small>
              </div>
            </DropdownToggle>

            <DropdownMenu end>
              <DropdownItem onClick={() => navigate("/profile")}>
                Profile
              </DropdownItem>

              <DropdownItem onClick={() => navigate("/settings")}>
                Settings
              </DropdownItem>

              <DropdownItem divider />

              <DropdownItem onClick={() => setOpenLogoutDialog(true)}>
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Nav>
      </Navbar>

      <Modal
        isOpen={openLogoutDialog}
        toggle={() => setOpenLogoutDialog(false)}
      >
        <ModalHeader toggle={() => setOpenLogoutDialog(false)}>
          Confirm Logout
        </ModalHeader>

        <ModalBody>Are you sure you want to log out?</ModalBody>

        <ModalFooter>
          <Button color="secondary" onClick={() => setOpenLogoutDialog(false)}>
            Cancel
          </Button>
          <Button color="danger" onClick={handleLogout}>
            Logout
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
