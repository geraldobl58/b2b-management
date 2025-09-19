"use client";

import { Box, Alert } from "@mui/material";
import { DatePickerProvider } from "@/components/shared";

interface LoadingStateProps {
  isLoading?: boolean;
  error?: string | null;
  loadingText?: string;
}

export const LoadingState = ({
  isLoading,
  error,
  loadingText = "Carregando dados do contrato...",
}: LoadingStateProps) => {
  if (isLoading) {
    return (
      <DatePickerProvider>
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          {loadingText}
        </Box>
      </DatePickerProvider>
    );
  }

  if (error) {
    return (
      <DatePickerProvider>
        <Alert severity="error" sx={{ mb: 2 }}>
          Erro ao carregar contrato: {error}
        </Alert>
      </DatePickerProvider>
    );
  }

  return null;
};
