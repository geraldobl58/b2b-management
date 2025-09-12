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
  CircularProgress,
} from "@mui/material";
import { X, Save, Plus } from "lucide-react";
import { ReactNode, FormEvent } from "react";

export type FormMode = "create" | "edit" | "view";

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  title: string;
  children: ReactNode;
  
  // Form configuration
  mode?: FormMode;
  isLoading?: boolean;
  disabled?: boolean;
  
  // Action buttons customization
  submitText?: string;
  cancelText?: string;
  showSubmit?: boolean;
  showCancel?: boolean;
  
  // Additional actions
  additionalActions?: Array<{
    label: string;
    onClick: () => void;
    color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
    variant?: "contained" | "outlined" | "text";
    disabled?: boolean;
    icon?: ReactNode;
  }>;

  // Dialog configuration
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  fullScreen?: boolean;
  
  // Header customization
  showCloseButton?: boolean;
  headerActions?: ReactNode;
  
  // Form validation
  hasErrors?: boolean;
  errorMessage?: string;
}

const getModeConfig = (mode: FormMode) => {
  switch (mode) {
    case "create":
      return {
        submitText: "Criar",
        submitIcon: <Plus size={16} />,
        submitColor: "primary" as const,
      };
    case "edit":
      return {
        submitText: "Salvar",
        submitIcon: <Save size={16} />,
        submitColor: "primary" as const,
      };
    case "view":
    default:
      return {
        submitText: "Ok",
        submitIcon: null,
        submitColor: "primary" as const,
      };
  }
};

export const FormDialog = ({
  open,
  onClose,
  onSubmit,
  title,
  children,
  mode = "create",
  isLoading = false,
  disabled = false,
  submitText,
  cancelText = "Cancelar",
  showSubmit = true,
  showCancel = true,
  additionalActions = [],
  maxWidth = "sm",
  fullWidth = true,
  fullScreen = false,
  showCloseButton = true,
  headerActions,
  hasErrors = false,
  errorMessage,
}: FormDialogProps) => {
  const config = getModeConfig(mode);
  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!disabled && !isLoading && !hasErrors) {
      await onSubmit(event);
    }
  };

  const finalSubmitText = submitText || config.submitText;
  const isViewMode = mode === "view";

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
      <form onSubmit={handleSubmit}>
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
            {isLoading && (
              <CircularProgress
                size={20}
                sx={{ marginLeft: 2 }}
              />
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {headerActions}
            {showCloseButton && (
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
            )}
          </Box>
        </DialogTitle>

        {/* Content */}
        <DialogContent sx={{ paddingTop: 2 }}>
          {children}
          
          {/* Error message */}
          {errorMessage && (
            <Box
              sx={{
                marginTop: 2,
                padding: 2,
                backgroundColor: "error.light",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "error.main",
              }}
            >
              <Typography variant="body2" color="error.main">
                {errorMessage}
              </Typography>
            </Box>
          )}
        </DialogContent>

        {/* Actions */}
        <DialogActions 
          sx={{ 
            padding: 3, 
            paddingTop: 2, 
            gap: 1,
            justifyContent: "flex-end",
          }}
        >
          {/* Additional actions */}
          {additionalActions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              variant={action.variant || "outlined"}
              color={action.color || "secondary"}
              disabled={action.disabled || isLoading}
              startIcon={action.icon}
              sx={{ minWidth: 100 }}
            >
              {action.label}
            </Button>
          ))}

          {/* Cancel button */}
          {showCancel && (
            <Button
              onClick={onClose}
              variant="outlined"
              disabled={isLoading}
              sx={{ minWidth: 100 }}
            >
              {cancelText}
            </Button>
          )}

          {/* Submit button */}
          {showSubmit && !isViewMode && (
            <Button
              type="submit"
              variant="contained"
              color={config.submitColor}
              disabled={disabled || isLoading || hasErrors}
              startIcon={isLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                config.submitIcon
              )}
              sx={{ minWidth: 100 }}
            >
              {isLoading ? "Salvando..." : finalSubmitText}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Hook para facilitar o uso do FormDialog
import { useState } from "react";

interface UseFormDialogProps {
  title: string;
  mode?: FormMode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  onSuccess?: () => void;
}

export const useFormDialog = (props: UseFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);

  const showDialog = () => {
    setOpen(true);
    setErrors(null);
  };
  
  const hideDialog = () => {
    setOpen(false);
    setIsLoading(false);
    setErrors(null);
  };

  const handleSubmit = async (submitFn: () => Promise<void> | void) => {
    try {
      setIsLoading(true);
      setErrors(null);
      await submitFn();
      props.onSuccess?.();
      hideDialog();
    } catch (error) {
      console.error("Form submission error:", error);
      setErrors(error instanceof Error ? error.message : "Erro ao processar formulário");
    } finally {
      setIsLoading(false);
    }
  };

  const DialogComponent = ({ 
    children,
    onSubmit,
    ...dialogProps
  }: Omit<FormDialogProps, "open" | "onClose" | "title" | "mode" | "isLoading" | "errorMessage"> & {
    children: ReactNode;
    onSubmit: () => Promise<void> | void;
  }) => (
    <FormDialog
      open={open}
      onClose={hideDialog}
      onSubmit={() => handleSubmit(onSubmit)}
      title={props.title}
      mode={props.mode}
      maxWidth={props.maxWidth}
      fullWidth={props.fullWidth}
      isLoading={isLoading}
      errorMessage={errors || undefined}
      hasErrors={!!errors}
      {...dialogProps}
    >
      {children}
    </FormDialog>
  );

  return {
    showDialog,
    hideDialog,
    DialogComponent,
    isOpen: open,
    isLoading,
    setIsLoading,
    errors,
    setErrors,
  };
};