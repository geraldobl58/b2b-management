"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Search, X } from "lucide-react";

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
} from "@mui/material";

import {
  searchCampaignSchema,
  SearchCampaignValues,
} from "../../schemas/campaign";
import {
  DatePickerProvider,
  FormDateRange,
} from "@/components/shared";

interface CampaignFiltersProps {
  clientName?: string;
  type?: "MKT" | "SALES" | "RETENTION" | "UPSELL";
  branchType?: "MATRIZ" | "FILIAL";
  startDate?: string;
  endDate?: string;
  onApplyFilters: (data: SearchCampaignValues) => void;
  onClearFilters: () => void;
}

export const CampaignFilters = ({
  clientName,
  type,
  branchType,
  startDate,
  endDate,
  onApplyFilters,
  onClearFilters,
}: CampaignFiltersProps) => {
  const {
    reset,
    control,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm<SearchCampaignValues>({
    resolver: zodResolver(searchCampaignSchema),
    defaultValues: {
      clientName: "",
      type: undefined,
      branchType: undefined,
      startDate: "",
      endDate: "",
    },
  });

  // Watch startDate for validation
  const watchedStartDate = watch("startDate");

  useEffect(() => {
    reset({
      clientName: clientName || "",
      type: type || undefined,
      branchType: branchType || undefined,
      startDate: startDate || "",
      endDate: endDate || "",
    });
  }, [clientName, type, branchType, startDate, endDate, reset]);

  const onSubmit = (data: SearchCampaignValues) => {
    onApplyFilters(data);
  };

  const handleClearFilters = () => {
    const resetValues: SearchCampaignValues = {
      clientName: "",
      type: undefined,
      branchType: undefined,
      startDate: "",
      endDate: "",
    };
    reset(resetValues);
    onClearFilters();
  };

  return (
    <DatePickerProvider>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Paper
          elevation={1}
          sx={{ display: "block", width: "100%" }}
          className="w-full max-w-full p-4 space-y-8"
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="flex-end"
            sx={{ flexWrap: "wrap" }}
          >
            <Box sx={{ flex: "1 1 240px", minWidth: { xs: "100%", sm: 240 } }}>
              <Controller
                name="clientName"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.clientName}>
                    <InputLabel id="client-name-label">
                      Nome do Cliente
                    </InputLabel>
                    <Select
                      labelId="client-name-label"
                      id="client-name-select"
                      value={field.value || ""}
                      label="Nome do Cliente"
                      onChange={field.onChange}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="INSENTO">Insento</MenuItem>
                    </Select>
                    {errors.clientName && (
                      <FormHelperText>
                        {errors.clientName?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>
            <Box sx={{ flex: "1 1 240px", minWidth: { xs: "100%", sm: 240 } }}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.type}>
                    <InputLabel id="type-label">Tipo</InputLabel>
                    <Select
                      labelId="type-label"
                      id="type-select"
                      value={field.value || ""}
                      label="Tipo"
                      onChange={field.onChange}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="MKT">Marketing</MenuItem>
                      <MenuItem value="SALES">Vendas</MenuItem>
                      <MenuItem value="RETENTION">Retenção</MenuItem>
                      <MenuItem value="UPSELL">Upsell</MenuItem>
                    </Select>
                    {errors.type && (
                      <FormHelperText>
                        {errors.type?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>

            <Box sx={{ flex: "1 1 240px", minWidth: { xs: "100%", sm: 240 } }}>
              <Controller
                name="branchType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.branchType}>
                    <InputLabel id="branch-type-label">Tipo de Filial</InputLabel>
                    <Select
                      labelId="branch-type-label"
                      id="branch-type-select"
                      value={field.value || ""}
                      label="Tipo de Filial"
                      onChange={field.onChange}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="MATRIZ">Matriz</MenuItem>
                      <MenuItem value="FILIAL">Filial</MenuItem>
                    </Select>
                    {errors.branchType && (
                      <FormHelperText>
                        {errors.branchType?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>

            <Box sx={{ flex: "2 1 480px", minWidth: { xs: "100%", sm: 480 } }}>
              <FormDateRange
                control={control}
                errors={errors}
                startDateName="startDate"
                endDateName="endDate"
                startDate={
                  watchedStartDate ? new Date(watchedStartDate) : undefined
                }
                layout="horizontal"
                allowPastDates={true} // Permite datas passadas nos filtros
                outputFormat="string" // Para filtros, usa strings
                startDateProps={{
                  label: "Data Inicial",
                }}
                endDateProps={{
                  label: "Data Final",
                }}
              />
            </Box>

            {/* Action buttons - kept fixed size and aligned */}
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Button
                type="submit"
                size="small"
                variant="contained"
                color="primary"
                startIcon={<Search />}
                sx={{ minWidth: 120, height: 40 }}
              >
                Filtrar
              </Button>

              <Button
                type="button"
                size="small"
                variant="contained"
                color="error"
                startIcon={<X />}
                onClick={handleClearFilters}
                sx={{ minWidth: 120, height: 40 }}
              >
                Limpar
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </DatePickerProvider>
  );
};
