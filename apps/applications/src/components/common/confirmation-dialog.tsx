"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { X, AlertTriangle, Trash2, Info, CheckCircle } from "lucide-react";
import { ReactNode } from "react";

export type DialogVariant = "delete" | "warning" | "info" | "confirm";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: DialogVariant;
  isLoading?: boolean;
  disabled?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}

const getVariantConfig = (variant: DialogVariant) => {
  switch (variant) {
    case "delete":
      return {
        icon: <Trash2 className="text-red-500" size={24} />,
        confirmColor: "error" as const,
        iconBgColor: "rgba(239, 68, 68, 0.1)",
        confirmText: "Excluir",
      };
    case "warning":
      return {
        icon: <AlertTriangle className="text-yellow-500" size={24} />,
        confirmColor: "warning" as const,
        iconBgColor: "rgba(245, 158, 11, 0.1)",
        confirmText: "Continuar",
      };
    case "info":
      return {
        icon: <Info className="text-blue-500" size={24} />,
        confirmColor: "primary" as const,
        iconBgColor: "rgba(59, 130, 246, 0.1)",
        confirmText: "Ok",
      };
    case "confirm":
    default:
      return {
        icon: <CheckCircle className="text-green-500" size={24} />,
        confirmColor: "primary" as const,
        iconBgColor: "rgba(34, 197, 94, 0.1)",
        confirmText: "Confirmar",
      };
  }
};

export const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText = "Cancelar",
  variant = "confirm",
  isLoading = false,
  disabled = false,
  maxWidth = "sm",
}: ConfirmationDialogProps) => {
  const config = getVariantConfig(variant);

  const handleConfirm = () => {
    if (!disabled && !isLoading) {
      onConfirm();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          padding: 1,
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
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: config.iconBgColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {config.icon}
          </Box>
          <Typography variant="h6" component="div" fontWeight="bold">
            {title}
          </Typography>
        </Box>
        
        <IconButton
          onClick={onClose}
          size="small"
          disabled={isLoading}
          sx={{
            color: "text.secondary",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ paddingTop: 2 }}>
        {typeof message === "string" ? (
          <Typography variant="body1" color="text.secondary">
            {message}
          </Typography>
        ) : (
          message
        )}
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ padding: 3, paddingTop: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={isLoading}
          sx={{ minWidth: 100 }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={config.confirmColor}
          disabled={disabled || isLoading}
          sx={{ minWidth: 100 }}
        >
          {isLoading ? "Carregando..." : confirmText || config.confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Hook personalizado para facilitar o uso
import { useState } from "react";

interface UseConfirmationDialogProps {
  title: string;
  message: string | ReactNode;
  variant?: DialogVariant;
  confirmText?: string;
  cancelText?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}

export const useConfirmationDialog = (props: UseConfirmationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showDialog = () => setOpen(true);
  const hideDialog = () => {
    setOpen(false);
    setIsLoading(false);
  };

  const DialogComponent = ({ 
    onConfirm, 
    disabled 
  }: { 
    onConfirm: () => void | Promise<void>; 
    disabled?: boolean;
  }) => (
    <ConfirmationDialog
      open={open}
      onClose={hideDialog}
      onConfirm={async () => {
        try {
          setIsLoading(true);
          await onConfirm();
          hideDialog();
        } catch (error) {
          console.error("Error in confirmation dialog:", error);
          setIsLoading(false);
        }
      }}
      title={props.title}
      message={props.message}
      variant={props.variant}
      confirmText={props.confirmText}
      cancelText={props.cancelText}
      maxWidth={props.maxWidth}
      isLoading={isLoading}
      disabled={disabled}
    />
  );

  return {
    showDialog,
    hideDialog,
    DialogComponent,
    isOpen: open,
    isLoading,
  };
};