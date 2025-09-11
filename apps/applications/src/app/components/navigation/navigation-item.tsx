"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import { ChevronDown, ChevronRight } from "lucide-react";
import { MenuItem } from "./types";
import { getIcon } from "./icon-utils";

interface NavigationItemProps {
  item: MenuItem;
  isOpen: boolean;
  level?: number;
  openMenu?: string | null;
  onMenuClick?: (menuLabel: string, shouldOpen: boolean) => void;
}

export const NavigationItem = ({ 
  item,
  isOpen,
  level = 0,
  openMenu,
  onMenuClick
}: NavigationItemProps) => {
  const pathname = usePathname();
  const hasChildren = item.items && item.items.length > 0;
  
  // Função para verificar se um caminho está ativo
  const isPathActive = (path: string) => {
    // Normaliza os caminhos removendo barras extras
    const normalizedPathname = pathname.replace(/\/+/g, '/');
    const normalizedPath = path.replace(/\/+/g, '/');
    
    return normalizedPathname === normalizedPath || 
           normalizedPathname.startsWith(normalizedPath + '/');
  };

  // Verifica se o item atual está ativo
  const isActive = item.path ? isPathActive(item.path) : false;
  
  // Log temporário para debug
  console.log(`Item: ${item.label}, Path: ${item.path}, Current: ${pathname}, Active: ${isActive}`);

  // Verifica recursivamente se algum filho está ativo
  const checkActiveChild = (items: MenuItem[]): boolean => {
    return items.some(child => {
      if (child.path && isPathActive(child.path)) {
        return true;
      }
      if (child.items && child.items.length > 0) {
        return checkActiveChild(child.items);
      }
      return false;
    });
  };

  const hasActiveChild = hasChildren ? checkActiveChild(item.items!) : false;

  // Para itens de nível 0 (principais), usa estado compartilhado
  // Para subitens, sempre expand se tem filhos ativos
  const expanded = level === 0 
    ? (openMenu === item.label || hasActiveChild)
    : hasActiveChild;

  // Auto-expand quando há filhos ativos
  useEffect(() => {
    if (hasActiveChild && level === 0 && onMenuClick) {
      onMenuClick(item.label, true);
    }
  }, [hasActiveChild, level, item.label, onMenuClick]);

  const handleClick = () => {
    if (hasChildren && level === 0 && onMenuClick) {
      const shouldOpen = openMenu !== item.label;
      onMenuClick(item.label, shouldOpen);
    }
  };

  const icon = getIcon(item.icon);
  const expandIcon = expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />;

  const buttonContent = (
    <ListItemButton
      onClick={handleClick}
      sx={[
        {
          minHeight: 48,
          px: 2.5,
          pl: level > 0 ? 4 + (level * 1.5) : 2.5,
          backgroundColor: (isActive || hasActiveChild) ? "action.selected" : "transparent",
          "&:hover": {
            backgroundColor: (isActive || hasActiveChild) ? "action.selected" : "action.hover",
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
            color: (isActive || hasActiveChild) ? "primary.main" : "inherit",
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
        primary={item.label}
        sx={[
          {
            color: (isActive || hasActiveChild) ? "primary.main" : "inherit",
            fontWeight: (isActive || hasActiveChild) ? 600 : 400,
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
      {hasChildren && isOpen && (
        <ListItemIcon
          sx={{
            minWidth: 0,
            justifyContent: "center",
            color: (isActive || hasActiveChild) ? "primary.main" : "inherit",
          }}
        >
          {expandIcon}
        </ListItemIcon>
      )}
    </ListItemButton>
  );

  return (
    <>
      <ListItem disablePadding sx={{ display: "block" }}>
        {item.path && !hasChildren ? (
          <Link href={item.path} style={{ textDecoration: "none", color: "inherit" }}>
            {buttonContent}
          </Link>
        ) : (
          buttonContent
        )}
      </ListItem>
      
      {hasChildren && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.items?.map((subItem) => (
              <NavigationItem
                key={subItem.label}
                item={subItem}
                isOpen={isOpen}
                level={level + 1}
                openMenu={openMenu}
                onMenuClick={onMenuClick}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};