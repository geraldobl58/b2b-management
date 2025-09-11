"use client";

import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { DrawerHeader as StyledDrawerHeader } from "./styles";

interface DrawerHeaderProps {
  onClose: () => void;
}

export const DrawerHeader = ({ onClose }: DrawerHeaderProps) => {
  const theme = useTheme();

  return (
    <StyledDrawerHeader>
      <IconButton onClick={onClose}>
        {theme.direction === "rtl" ? (
          <ChevronRightIcon />
        ) : (
          <ChevronLeftIcon />
        )}
      </IconButton>
    </StyledDrawerHeader>
  );
};