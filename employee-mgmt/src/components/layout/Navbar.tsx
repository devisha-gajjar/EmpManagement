import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Divider,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";

// Mock notification data - replace with your actual data
interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: "info" | "warning" | "success" | "error";
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Document Submission",
    message: "John Doe has submitted 3 new documents for approval.",
    time: "13m ago",
    isRead: false,
    type: "info",
  },
  {
    id: "2",
    title: "Urgent Review Required",
    message: "5 documents are pending review for more than 24 hours.",
    time: "1h ago",
    isRead: false,
    type: "warning",
  },
  {
    id: "3",
    title: "Leave Request Approved",
    message: "Your leave request for Dec 25-27 has been approved.",
    time: "2h ago",
    isRead: true,
    type: "success",
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userName, role } = useAppSelector((state) => state.auth);

  const [notificationAnchor, setNotificationAnchor] =
    useState<null | HTMLElement>(null);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleViewAllNotifications = () => {
    handleNotificationClose();
    navigate("/notifications");
  };

  const handleLogout = () => {
    handleProfileClose();
    dispatch(logout());
  };

  const getNotificationIcon = (type: string) => {
    const iconStyle = {
      width: 40,
      height: 40,
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
    };

    switch (type) {
      case "warning":
        return (
          <Box sx={{ ...iconStyle, backgroundColor: "rgba(239, 68, 68, 0.1)" }}>
            <i
              className="bi bi-exclamation-triangle-fill"
              style={{ color: "#ef4444" }}
            ></i>
          </Box>
        );
      case "success":
        return (
          <Box sx={{ ...iconStyle, backgroundColor: "rgba(34, 197, 94, 0.1)" }}>
            <i
              className="bi bi-check-circle-fill"
              style={{ color: "#22c55e" }}
            ></i>
          </Box>
        );
      case "error":
        return (
          <Box sx={{ ...iconStyle, backgroundColor: "rgba(239, 68, 68, 0.1)" }}>
            <i className="bi bi-x-circle-fill" style={{ color: "#ef4444" }}></i>
          </Box>
        );
      default:
        return (
          <Box
            sx={{ ...iconStyle, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
          >
            <i
              className="bi bi-file-earmark-text-fill"
              style={{ color: "#3b82f6" }}
            ></i>
          </Box>
        );
    }
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={(theme) => ({
        backgroundColor: theme.palette.background.default,
        mb: 3,
        padding: "0.5rem",
        borderBottom: `1px solid ${theme.palette.divider}`,
      })}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "end",
          px: 0,
          minHeight: "64px !important",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Notifications */}
          <IconButton
            onClick={handleNotificationClick}
            sx={(theme) => ({
              color: theme.palette.text.secondary,
              backgroundColor: theme.palette.action.hover,
              "&:hover": {
                backgroundColor: theme.palette.action.selected,
              },
            })}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Profile */}
          <IconButton
            onClick={handleProfileClick}
            sx={{
              padding: 0,
              ml: 1,
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: "#3b82f6",
                fontWeight: 600,
              }}
            >
              {userName?.charAt(0).toUpperCase() || "U"}
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 420,
            maxHeight: 500,
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: "12px",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                color: "#3b82f6",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              {unreadCount} unread
            </Box>
          )}
        </Box>
        <Divider />

        {/* Notification List */}
        <Box sx={{ maxHeight: 350, overflowY: "auto" }}>
          {notifications.length === 0 ? (
            <Box
              sx={{
                py: 4,
                px: 2,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <NotificationsIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
              <Typography variant="body2">No notifications</Typography>
            </Box>
          ) : (
            notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                sx={{
                  px: 2,
                  py: 1.5,
                  backgroundColor: notification.isRead
                    ? "transparent"
                    : "rgba(59, 130, 246, 0.05)",
                  borderLeft: notification.isRead
                    ? "none"
                    : "3px solid #3b82f6",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                  display: "block",
                }}
              >
                <Box sx={{ display: "flex", gap: 1.5 }}>
                  {/* Icon */}
                  {getNotificationIcon(notification.type)}

                  {/* Content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        mb: 0.5,
                        color: "text.primary",
                      }}
                    >
                      {notification.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        mb: 0.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {notification.message}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.disabled" }}
                    >
                      {notification.time}
                    </Typography>
                  </Box>

                  {/* Actions */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                  >
                    {!notification.isRead && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        sx={{
                          color: "#3b82f6",
                          "&:hover": {
                            backgroundColor: "rgba(59, 130, 246, 0.1)",
                          },
                        }}
                      >
                        <CheckIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification.id);
                      }}
                      sx={{
                        color: "#ef4444",
                        "&:hover": {
                          backgroundColor: "rgba(239, 68, 68, 0.1)",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </MenuItem>
            ))
          )}
        </Box>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1.5 }}>
              <Button
                fullWidth
                onClick={handleViewAllNotifications}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
                  color: "#3b82f6",
                  "&:hover": {
                    backgroundColor: "rgba(59, 130, 246, 0.08)",
                  },
                }}
              >
                <i className="bi bi-arrow-right-circle me-2"></i>
                View All Notifications
              </Button>
            </Box>
          </>
        )}
      </Menu>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={handleProfileClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 280,
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* Profile Header */}
        <Box sx={{ px: 3, py: 2, backgroundColor: "rgba(59, 130, 246, 0.05)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              sx={{
                width: 35,
                height: 35,
                bgcolor: "#3b82f6",
                fontWeight: 600,
                fontSize: "15px",
              }}
            >
              {userName?.charAt(0).toUpperCase() || "U"}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {userName || "User Name"}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {role || "User"}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider />

        {/* Menu Items */}
        <MenuItem
          onClick={() => {
            handleProfileClose();
            navigate("/user/profile");
          }}
          sx={{
            py: 1.5,
            "&:hover": {
              backgroundColor: "rgba(59, 130, 246, 0.08)",
            },
          }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" sx={{ color: "#3b82f6" }} />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleProfileClose();
            navigate("/user/settings");
          }}
          sx={{
            py: 1.5,
            "&:hover": {
              backgroundColor: "rgba(59, 130, 246, 0.08)",
            },
          }}
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" sx={{ color: "#3b82f6" }} />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            color: "#ef4444",
            "&:hover": {
              backgroundColor: "rgba(239, 68, 68, 0.08)",
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: "#ef4444" }} />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar;
