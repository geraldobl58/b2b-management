"use client";

import { DrawerHeader } from "./drawer-header";
import { StyledDrawer } from "./styles";
import { primaryMenuItems } from "./navigation-data";
import { MenuItem } from "../navigation/types";
import { SidebarNavigation } from "../navigation/sidebar-navigation";
import { Logo } from "../logo";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  menuItems?: MenuItem[];
}

export const Sidebar = ({ open, onClose, menuItems = primaryMenuItems }: SidebarProps) => {
  return (
    <StyledDrawer variant="permanent" open={open}>
      <SidebarNavigation
        items={menuItems}
        isOpen={open}
        logo={<Logo />}
        header={<DrawerHeader onClose={onClose} />}
      />
    </StyledDrawer>
  );
};
