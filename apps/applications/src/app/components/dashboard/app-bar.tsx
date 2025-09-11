"use client";

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { StyledAppBar } from "./styles";

interface DashboardAppBarProps {
  open: boolean;
  onDrawerOpen: () => void;
  title?: string;
}

export const DashboardAppBar = ({ open, onDrawerOpen, title = "Dashboard" }: DashboardAppBarProps) => {
  return (
    <StyledAppBar position="fixed" open={open}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onDrawerOpen}
          edge="start"
          sx={[
            {
              marginRight: 5,
            },
            open && { display: "none" },
          ]}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          {title}
        </Typography>
      </Toolbar>
    </StyledAppBar>
  );
};