"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface GenericDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  
  // Action buttons
  primaryAction?: {
    label: string;
    onClick: () => void | Promise<void>;
    color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
    variant?: "contained" | "outlined" | "text";
    disabled?: boolean;
    loading?: boolean;
  };
  
  secondaryAction?: {
    label: string;
    onClick: () => void;
    color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
    variant?: "contained" | "outlined" | "text";
    disabled?: boolean;
  };

  // Additional actions (for more than 2 buttons)
  additionalActions?: Array<{
    label: string;
    onClick: () => void | Promise<void>;
    color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
    variant?: "contained" | "outlined" | "text";
    disabled?: boolean;
  }>;

  // Dialog configuration
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  fullScreen?: boolean;
  disableEscapeKeyDown?: boolean;
  disableBackdropClick?: boolean;
  
  // Header customization
  showCloseButton?: boolean;
  headerActions?: ReactNode;
  
  // Footer customization
  hideActions?: boolean;
  actionsAlignment?: "left" | "center" | "right" | "space-between";
}

export const GenericDialog = ({
  open,
  onClose,
  title,
  children,
  primaryAction,
  secondaryAction,
  additionalActions = [],
  maxWidth = "sm",
  fullWidth = true,
  fullScreen = false,
  disableEscapeKeyDown = false,
  disableBackdropClick = false,
  showCloseButton = true,
  headerActions,
  hideActions = false,
  actionsAlignment = "right",
}: GenericDialogProps) => {
  const handleClose = (event: any, reason?: string) => {
    if (disableBackdropClick && reason === "backdropClick") return;
    if (disableEscapeKeyDown && reason === "escapeKeyDown") return;
    onClose();
  };

  const getActionsJustifyContent = () => {
    switch (actionsAlignment) {
      case "left": return "flex-start";
      case "center": return "center";
      case "space-between": return "space-between";
      case "right":
      default: return "flex-end";
    }
  };

  const allActions = [
    ...(secondaryAction ? [secondaryAction] : []),
    ...additionalActions,
    ...(primaryAction ? [primaryAction] : []),
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 2,
          minHeight: fullScreen ? "100vh" : "auto",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: 1,
          paddingRight: showCloseButton ? 1 : 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
          <Typography variant="h6" component="div" fontWeight="bold">
            {title}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {headerActions}
          {showCloseButton && (
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: "text.secondary",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <X size={20} />
            </IconButton>
          )}
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ paddingTop: 2 }}>
        {children}
      </DialogContent>

      {/* Actions */}
      {!hideActions && allActions.length > 0 && (
        <DialogActions 
          sx={{ 
            padding: 3, 
            paddingTop: 2, 
            gap: 1,
            justifyContent: getActionsJustifyContent(),
          }}
        >
          {allActions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              variant={action.variant || "outlined"}
              color={action.color || "primary"}
              disabled={action.disabled}
              sx={{ minWidth: 100 }}
            >
              {action.loading ? "Carregando..." : action.label}
            </Button>
          ))}
        </DialogActions>
      )}
    </Dialog>
  );
};

// Hook para facilitar o uso
import { useState } from "react";

interface UseGenericDialogProps {
  title: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  fullScreen?: boolean;
}

export const useGenericDialog = (props: UseGenericDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showDialog = () => setOpen(true);
  const hideDialog = () => {
    setOpen(false);
    setIsLoading(false);
  };

  const DialogComponent = ({ 
    children,
    primaryAction,
    secondaryAction,
    additionalActions,
    ...dialogProps
  }: Omit<GenericDialogProps, "open" | "onClose" | "title"> & {
    children: ReactNode;
  }) => (
    <GenericDialog
      open={open}
      onClose={hideDialog}
      title={props.title}
      maxWidth={props.maxWidth}
      fullWidth={props.fullWidth}
      fullScreen={props.fullScreen}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      additionalActions={additionalActions}
      {...dialogProps}
    >
      {children}
    </GenericDialog>
  );

  return {
    showDialog,
    hideDialog,
    DialogComponent,
    isOpen: open,
    isLoading,
    setIsLoading,
  };
};