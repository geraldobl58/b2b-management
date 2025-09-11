"use client";

import { ReactNode, useState, useCallback } from "react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import { NavigationItem } from "./navigation-item";
import { MenuItem } from "./types";

interface SidebarNavigationProps {
  items: MenuItem[];
  isOpen: boolean;
  logo?: ReactNode;
  header?: ReactNode;
}

export const SidebarNavigation = ({
  items,
  isOpen,
  logo,
  header,
}: SidebarNavigationProps) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleMenuClick = useCallback((menuLabel: string, shouldOpen: boolean) => {
    if (shouldOpen) {
      setOpenMenu(menuLabel);
    } else {
      setOpenMenu(null);
    }
  }, []);

  return (
    <>
      {(logo || header) && (
        <>
          <div className="flex items-center justify-between px-2">
            {logo}
            {header}
          </div>
          <Divider />
        </>
      )}
      <List>
        {items.map((item) => (
          <NavigationItem
            key={item.label}
            item={item}
            isOpen={isOpen}
            openMenu={openMenu}
            onMenuClick={handleMenuClick}
          />
        ))}
      </List>
      <Divider />
    </>
  );
};
