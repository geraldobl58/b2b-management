"use client";

import { DrawerHeader } from "./drawer-header";
import { StyledDrawer } from "./styles";
import { sidebarMenu } from "../navigation/menu";
import { MenuItem } from "../navigation/types";
import { SidebarNavigation } from "../navigation/sidebar-navigation";
import { Logo } from "../logo";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  menuItems?: MenuItem[];
}

export const Sidebar = ({ open, onClose, menuItems = sidebarMenu }: SidebarProps) => {
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
