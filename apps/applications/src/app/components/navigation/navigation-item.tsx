"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

interface NavigationItemProps {
  text: string;
  icon: ReactNode;
  href?: string;
  isOpen: boolean;
  onClick?: () => void;
}

export const NavigationItem = ({ 
  text, 
  icon, 
  href, 
  isOpen, 
  onClick 
}: NavigationItemProps) => {
  const pathname = usePathname();
  
  // Verifica se está ativo considerando:
  // 1. Path exato (/dashboard === /dashboard)
  // 2. Path que começa com href (/dashboard/analytics com href="/dashboard")
  // 3. Casos especiais como "/campaign" ativo quando em "/campaign"
  const isActive = href ? (
    pathname === href || 
    pathname.startsWith(href + '/') ||
    (href !== '/' && pathname.includes(href.split('/').pop() || ''))
  ) : false;

  const buttonContent = (
    <ListItemButton
      onClick={onClick}
      sx={[
        {
          minHeight: 48,
          px: 2.5,
          backgroundColor: isActive ? "action.selected" : "transparent",
          "&:hover": {
            backgroundColor: isActive ? "action.selected" : "action.hover",
          },
        },
        isOpen
          ? {
              justifyContent: "initial",
            }
          : {
              justifyContent: "center",
            },
      ]}
    >
      <ListItemIcon
        sx={[
          {
            minWidth: 0,
            justifyContent: "center",
            color: isActive ? "primary.main" : "inherit",
          },
          isOpen
            ? {
                mr: 3,
              }
            : {
                mr: "auto",
              },
        ]}
      >
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={text}
        sx={[
          {
            color: isActive ? "primary.main" : "inherit",
            fontWeight: isActive ? 600 : 400,
          },
          isOpen
            ? {
                opacity: 1,
              }
            : {
                opacity: 0,
              },
        ]}
      />
    </ListItemButton>
  );

  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      {href ? (
        <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
          {buttonContent}
        </Link>
      ) : (
        buttonContent
      )}
    </ListItem>
  );
};