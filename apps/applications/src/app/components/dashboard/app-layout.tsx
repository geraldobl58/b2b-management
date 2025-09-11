"use client";

import { useState, ReactNode } from "react";
import { DashboardAppBar } from "./app-bar";
import { Sidebar } from "./sidebar";
import { DrawerHeader } from "./styles";
import { SidebarLayout } from "../layout/sidebar-layout";
import { MenuItem } from "../navigation/types";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  menuItems?: MenuItem[];
}

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

export const AppLayout = ({ children, title, menuItems }: AppLayoutProps) => {
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <SidebarLayout
      appBar={
        <DashboardAppBar 
          open={open} 
          onDrawerOpen={handleDrawerOpen} 
          title={title}
        />
      }
      sidebar={
        <Sidebar 
          open={open} 
          onClose={handleDrawerClose} 
          menuItems={menuItems}
        />
      }
      drawerHeader={<DrawerHeader />}
    >
      {children}
    </SidebarLayout>
  );
};

export const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  return <AppLayout title={title}>{children}</AppLayout>;
};