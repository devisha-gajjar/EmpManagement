import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Box,
  Divider,
  IconButton,
  Tooltip,
  Paper,
  Popper,
  ClickAwayListener,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { getSideBarLinksByRole } from "../../utils/constant";
import { useAppDispatch } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";

interface SidebarProps {
  role: string;
  drawerWidth?: number;
}

const Sidebar = ({ role, drawerWidth = 260 }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [openMenu, setOpenMenu] = useState<{ [key: string]: boolean }>({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState<{
    element: HTMLElement | null;
    link: any;
  }>({ element: null, link: null });

  const collapsedWidth = 70;
  const currentWidth = isCollapsed ? collapsedWidth : drawerWidth;

  const navLinks = getSideBarLinksByRole(role);

  useEffect(() => {
    const newOpenState: { [key: string]: boolean } = {};

    navLinks.forEach((link) => {
      if (link.subMenu) {
        const match = link.subMenu.some(
          (x: any) => x.path === location.pathname
        );
        if (match) {
          newOpenState[link.name] = true;
        }
      }
    });

    setOpenMenu(newOpenState);
  }, [location.pathname]);

  const handleMenuClick = (name: string) => {
    if (isCollapsed) return;
    setOpenMenu((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const isParentActive = (link: any) => {
    const directMatch = location.pathname === link.path;
    const childMatch =
      link.subMenu &&
      link.subMenu.some((sub: any) => sub.path === location.pathname);
    return directMatch || childMatch;
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setOpenMenu({});
    }
  };

  const [isHoveringPopover, setIsHoveringPopover] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement>,
    link: any
  ) => {
    if (isCollapsed && link.subMenu) {
      setPopoverAnchor({ element: event.currentTarget, link });
      setIsHoveringButton(true);
    }
  };

  const handlePopoverClose = () => {
    setIsHoveringButton(false);
    setTimeout(() => {
      if (!isHoveringPopover) {
        setPopoverAnchor({ element: null, link: null });
      }
    }, 100);
  };

  const handlePopoverMouseEnter = () => {
    setIsHoveringPopover(true);
  };

  const handlePopoverMouseLeave = () => {
    setIsHoveringPopover(false);
    setTimeout(() => {
      if (!isHoveringButton) {
        setPopoverAnchor({ element: null, link: null });
      }
    }, 100);
  };

  const handleSubMenuClick = (path: string) => {
    navigate(path);
    handlePopoverClose();
  };

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: currentWidth,
          flexShrink: 0,
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          [`& .MuiDrawer-paper`]: {
            width: currentWidth,
            boxSizing: "border-box",
            height: `100vh`,
            padding: "16px 12px",
            backgroundColor: "#0a1929",
            color: "#e3e8ef",
            borderRight: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            flexDirection: "column",
            transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            overflowX: "hidden",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: isCollapsed ? 1 : 2,
            py: 2,
            mb: 2,
            borderRadius: "12px",
            background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
            justifyContent: isCollapsed ? "center" : "flex-start",
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
            }}
          >
            <i className="bi bi-briefcase-fill" style={{ color: "#fff" }}></i>
          </Box>
          {!isCollapsed && (
            <Box>
              <Box sx={{ fontWeight: 700, fontSize: "18px", color: "#fff" }}>
                Employee
              </Box>
              <Box sx={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>
                Management System
              </Box>
            </Box>
          )}
        </Box>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)", mb: 1 }} />
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
          <IconButton
            onClick={toggleSidebar}
            sx={{
              color: "#94a3b8",
              backgroundColor: "rgba(148, 163, 184, 0.08)",
              width: 32,
              height: 32,
              "&:hover": {
                backgroundColor: "rgba(59, 130, 246, 0.15)",
                color: "#3b82f6",
              },
              borderRadius: "10px",
            }}
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          <List sx={{ px: 0.5 }}>
            {navLinks.map((link) => {
              const active = isParentActive(link);
              const isOpen = openMenu[link.name] || false;

              return (
                <React.Fragment key={link.name}>
                  <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <Tooltip
                      title={isCollapsed ? link.name : ""}
                      placement="right"
                      arrow
                    >
                      <ListItemButton
                        selected={active}
                        onMouseEnter={(e) => handlePopoverOpen(e, link)}
                        onMouseLeave={handlePopoverClose}
                        onClick={() => {
                          if (link.subMenu) {
                            if (!isCollapsed) {
                              handleMenuClick(link.name);
                            }
                          } else {
                            navigate(link.path);
                          }
                        }}
                        sx={{
                          borderRadius: "10px",
                          py: 1.3,
                          px: isCollapsed ? 1 : 2,
                          gap: 1.8,
                          backgroundColor: active
                            ? "rgba(59, 130, 246, 0.15)"
                            : "transparent",
                          color: active ? "#3b82f6" : "#94a3b8",
                          border: active
                            ? "1px solid rgba(59, 130, 246, 0.3)"
                            : "1px solid transparent",
                          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                          position: "relative",
                          overflow: "hidden",
                          justifyContent: isCollapsed ? "center" : "flex-start",

                          "&::before": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: "3px",
                            backgroundColor: "#3b82f6",
                            opacity: active ? 1 : 0,
                            transition: "opacity 0.2s",
                          },

                          "&:hover": {
                            bgcolor: active
                              ? "rgba(59, 130, 246, 0.2)"
                              : "rgba(148, 163, 184, 0.08)",
                            color: active ? "#3b82f6" : "#cbd5e1",
                            transform: isCollapsed ? "none" : "translateX(2px)",
                          },

                          "& .MuiListItemText-primary": {
                            fontWeight: active ? 600 : 500,
                            fontSize: "14px",
                            letterSpacing: "0.01em",
                          },
                        }}
                      >
                        {link.icon && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              fontSize: "18px",
                              color: "inherit",
                              minWidth: "20px",
                            }}
                          >
                            <i className={link.icon}></i>
                          </Box>
                        )}
                        {!isCollapsed && (
                          <>
                            <ListItemText
                              primary={link.name}
                              sx={{ margin: 0 }}
                            />
                            {link.subMenu && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  color: "inherit",
                                  opacity: 0.7,
                                }}
                              >
                                {isOpen ? (
                                  <ExpandLess fontSize="small" />
                                ) : (
                                  <ExpandMore fontSize="small" />
                                )}
                              </Box>
                            )}
                          </>
                        )}
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>

                  {link.subMenu && !isCollapsed && (
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {link.subMenu.map((sub) => {
                          const subActive = sub.path === location.pathname;

                          return (
                            <ListItem
                              key={sub.name}
                              sx={{ pl: 2, mb: 0.5, mt: 0 }}
                            >
                              <ListItemButton
                                selected={subActive}
                                onClick={() => navigate(sub.path)}
                                sx={{
                                  borderRadius: "8px",
                                  py: 1,
                                  px: 2,
                                  gap: 1.5,
                                  ml: 2.5,
                                  bgcolor: subActive
                                    ? "rgba(59, 130, 246, 0.1)"
                                    : "transparent",
                                  color: subActive ? "#3b82f6" : "#94a3b8",
                                  borderLeft: subActive
                                    ? "2px solid #3b82f6"
                                    : "2px solid transparent",
                                  transition: "all 0.2s",

                                  "&:hover": {
                                    bgcolor: subActive
                                      ? "rgba(59, 130, 246, 0.15)"
                                      : "rgba(148, 163, 184, 0.06)",
                                    color: subActive ? "#3b82f6" : "#cbd5e1",
                                    transform: "translateX(2px)",
                                  },

                                  "& .MuiListItemText-primary": {
                                    fontSize: "13px",
                                    fontWeight: subActive ? 600 : 400,
                                  },
                                }}
                              >
                                {sub.icon && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      fontSize: "16px",
                                      color: "inherit",
                                      minWidth: "18px",
                                    }}
                                  >
                                    <i className={sub.icon}></i>
                                  </Box>
                                )}
                                <ListItemText
                                  primary={sub.name}
                                  sx={{ m: 0 }}
                                />
                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Collapse>
                  )}
                </React.Fragment>
              );
            })}
          </List>
        </Box>

        {/* Logout Button - Fixed at Bottom */}
        <Box sx={{ mt: "auto", px: 0.5 }}>
          <Divider
            sx={{
              borderColor: "rgba(255, 255, 255, 0.08)",
              mb: 1.5,
            }}
          />
          <Tooltip title={isCollapsed ? "Logout" : ""} placement="right" arrow>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: "10px",
                py: 1.3,
                px: isCollapsed ? 1 : 2,
                gap: 1.8,
                backgroundColor: "transparent",
                color: "#ef4444",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                justifyContent: isCollapsed ? "center" : "flex-start",

                "&:hover": {
                  bgcolor: "rgba(239, 68, 68, 0.1)",
                  borderColor: "rgba(239, 68, 68, 0.4)",
                  transform: isCollapsed ? "none" : "translateX(2px)",
                },

                "& .MuiListItemText-primary": {
                  fontWeight: 600,
                  fontSize: "14px",
                  letterSpacing: "0.01em",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "18px",
                  color: "inherit",
                  minWidth: "20px",
                }}
              >
                <i className="bi bi-box-arrow-right"></i>
              </Box>
              {!isCollapsed && (
                <ListItemText primary="Logout" sx={{ margin: 0 }} />
              )}
            </ListItemButton>
          </Tooltip>
        </Box>
      </Drawer>

      {/* Floating Submenu Popover for Collapsed State */}
      <Popper
        open={Boolean(popoverAnchor.element && popoverAnchor.link?.subMenu)}
        anchorEl={popoverAnchor.element}
        placement="right-start"
        disablePortal={false}
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 8],
            },
          },
        ]}
        sx={{ zIndex: 1300 }}
      >
        <Paper
          onMouseEnter={handlePopoverMouseEnter}
          onMouseLeave={handlePopoverMouseLeave}
          sx={{
            backgroundColor: "#0f172a",
            color: "#e3e8ef",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
            minWidth: 200,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
            }}
          >
            <Box sx={{ fontWeight: 600, fontSize: "14px", color: "#3b82f6" }}>
              {popoverAnchor.link?.name}
            </Box>
          </Box>
          <List sx={{ py: 1 }}>
            {popoverAnchor.link?.subMenu?.map((sub: any) => {
              const subActive = sub.path === location.pathname;
              return (
                <ListItem key={sub.name} disablePadding sx={{ px: 1 }}>
                  <ListItemButton
                    selected={subActive}
                    onClick={() => handleSubMenuClick(sub.path)}
                    sx={{
                      borderRadius: "8px",
                      py: 1,
                      px: 2,
                      gap: 1.5,
                      bgcolor: subActive
                        ? "rgba(59, 130, 246, 0.15)"
                        : "transparent",
                      color: subActive ? "#3b82f6" : "#94a3b8",

                      "&:hover": {
                        bgcolor: subActive
                          ? "rgba(59, 130, 246, 0.2)"
                          : "rgba(148, 163, 184, 0.08)",
                        color: subActive ? "#3b82f6" : "#cbd5e1",
                      },

                      "& .MuiListItemText-primary": {
                        fontSize: "13px",
                        fontWeight: subActive ? 600 : 400,
                      },
                    }}
                  >
                    {sub.icon && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "16px",
                          color: "inherit",
                          minWidth: "18px",
                        }}
                      >
                        <i className={sub.icon}></i>
                      </Box>
                    )}
                    <ListItemText primary={sub.name} sx={{ m: 0 }} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Paper>
      </Popper>
    </>
  );
};

export default Sidebar;
