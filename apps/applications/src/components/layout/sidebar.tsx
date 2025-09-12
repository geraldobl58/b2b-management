"use client";

import { DrawerHeader } from "./drawer-header";
import { sidebarMenu } from "../navigation/menu";
import { MenuItem } from "../navigation/types";
import { SidebarNavigation } from "../navigation/sidebar-navigation";
import { Logo } from "../logo";
import { useAuth } from "@/hooks/use-auth";
import { IconButton } from "@mui/material";
import { LogOut } from "lucide-react";
import { StyledDrawer } from "@/theme/styles";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  menuItems?: MenuItem[];
}

export const Sidebar = ({
  open,
  onClose,
  menuItems = sidebarMenu,
}: SidebarProps) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <StyledDrawer variant="permanent" open={open}>
      <div>
        <SidebarNavigation
          items={menuItems}
          isOpen={open}
          logo={<Logo />}
          header={<DrawerHeader onClose={onClose} />}
        />
      </div>
      <div>
        {user && (
          <div className="bg-white rounded-lg shadow border-t p-2 m-2 border-gray-100">
            <div className="flex items-center justify-between p-2">
              <p className="text-md">
                Seja bem-vindo, <span className="font-bold">{user.name}</span>!
              </p>
              <IconButton size="small" onClick={handleLogout}>
                <LogOut />
              </IconButton>
            </div>
          </div>
        )}
      </div>
    </StyledDrawer>
  );
};
