"use client";

import { Controller, Control, FieldErrors } from "react-hook-form";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
} from "@mui/material";
import { FormContractValues } from "@/features/contracts/schemas/contract";

interface Client {
  id: string;
  companyName: string;
  fantasyName?: string | null;
}

interface ClientSelectProps {
  control: Control<FormContractValues>;
  errors: FieldErrors<FormContractValues>;
  clients?: Client[];
  isLoading?: boolean;
  isLoadingClients?: boolean;
}

export const ClientSelect = ({
  control,
  errors,
  clients,
  isLoading,
  isLoadingClients,
}: ClientSelectProps) => {
  return (
    <Controller
      name="clientId"
      control={control}
      render={({ field }) => (
        <FormControl fullWidth size="small" error={!!errors.clientId}>
          <InputLabel>Cliente *</InputLabel>
          <Select
            {...field}
            label="Cliente *"
            disabled={isLoading || isLoadingClients}
          >
            {clients?.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                {client.companyName} (
                {client.fantasyName || "Sem nome fantasia"})
              </MenuItem>
            ))}
          </Select>
          {errors.clientId && (
            <FormHelperText>{errors.clientId.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};
