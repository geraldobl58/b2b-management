"use client";

import { ReactNode } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

interface SidebarLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  appBar: ReactNode;
  drawerHeader?: ReactNode;
}

export const SidebarLayout = ({
  children,
  sidebar,
  appBar,
  drawerHeader,
}: SidebarLayoutProps) => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {appBar}
      {sidebar}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {drawerHeader}
        {children}
      </Box>
    </Box>
  );
};
