"use client";

import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import { NavigationItem } from "./navigation-item";
import { DrawerHeader } from "./drawer-header";
import { StyledDrawer } from "./styles";
import { primaryMenuItems } from "./navigation-data";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar = ({ open, onClose }: SidebarProps) => {
  return (
    <StyledDrawer variant="permanent" open={open}>
      <DrawerHeader onClose={onClose} />
      <Divider />
      <List>
        {primaryMenuItems.map((item) => (
          <NavigationItem
            key={item.text}
            text={item.text}
            icon={item.icon}
            open={open}
          />
        ))}
      </List>
      <Divider />
    </StyledDrawer>
  );
};
