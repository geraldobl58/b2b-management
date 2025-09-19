"use client";

import { Alert } from "@mui/material";

interface FormErrorAlertProps {
  error?: string | null;
}

export const FormErrorAlert = ({ error }: FormErrorAlertProps) => {
  if (!error) return null;

  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      {error}
    </Alert>
  );
};
