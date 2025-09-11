"use client";

import { ReactNode } from "react";
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
            key={item.text}
            text={item.text}
            icon={item.icon}
            href={item.href}
            isOpen={isOpen}
          />
        ))}
      </List>
      <Divider />
    </>
  );
};