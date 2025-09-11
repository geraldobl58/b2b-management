"use client";

import { useState, ReactNode } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { DashboardAppBar } from "./app-bar";
import { Sidebar } from "./sidebar";
import { DrawerHeader } from "./styles";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

export const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <DashboardAppBar 
        open={open} 
        onDrawerOpen={handleDrawerOpen} 
        title={title}
      />
      <Sidebar 
        open={open} 
        onClose={handleDrawerClose} 
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
};