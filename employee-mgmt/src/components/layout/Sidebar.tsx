import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { getSideBarLinksByRole } from "../../utils/constant";

interface SidebarProps {
  role: string;
  drawerWidth?: number;
}

const Sidebar = ({ role, drawerWidth = 240 }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const navLinks = getSideBarLinksByRole(role);

  const handleMenuClick = (name: string) => {
    setOpenMenu((prev) => (prev === name ? null : name));
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          height: `calc(100vh - 64px)`, 
          top: "64px", 
        },
      }}
    >
      <List>
        {navLinks.map((link) => (
          <React.Fragment key={link.name}>
            <ListItem disablePadding>
              <ListItemButton
                selected={location.pathname === link.path}
                onClick={() => {
                  if (link.subMenu) {
                    handleMenuClick(link.name);
                  } else {
                    navigate(link.path);
                  }
                }}
              >
                <ListItemText primary={link.name} />
                {link.subMenu ? (
                  openMenu === link.name ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )
                ) : null}
              </ListItemButton>
            </ListItem>

            {link.subMenu && (
              <Collapse
                in={openMenu === link.name}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {link.subMenu.map((sub) => (
                    <ListItem key={sub.name} sx={{ pl: 4 }}>
                      <ListItemButton
                        selected={location.pathname === sub.path}
                        onClick={() => navigate(sub.path)}
                      >
                        <ListItemText primary={sub.name} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
