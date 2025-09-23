"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { Search, X } from "lucide-react";

import {
  Box,
  Button,
  Paper,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";

import {
  searchCampaignSchema,
  SearchCampaignValues,
} from "@/features/campaigns/schemas/search-campaign";
import {
  DatePickerProvider,
  FormTextField,
  FormDateRange,
} from "@/components/shared";

interface CampaignFiltersProps {
  search?: string;
  type?: "MKT" | "SALES" | "RETENTION" | "UPSELL";
  branchType?: "MATRIZ" | "FILIAL";
  clientId?: string;
  startDate?: string;
  endDate?: string;
  onApplyFilters: (data: SearchCampaignValues) => void;
  onClearFilters: () => void;
}

export const CampaignFilters = ({
  search,
  type,
  branchType,
  clientId,
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
      search: "",
      type: undefined,
      branchType: undefined,
      clientId: "",
      startDate: "",
      endDate: "",
    },
  });

  // Watch startDate for validation
  const watchedStartDate = watch("startDate");

  // Sync form with props when URL params change
  useEffect(() => {
    reset({
      search: search || "",
      type: type || undefined,
      branchType: branchType || undefined,
      clientId: clientId || "",
      startDate: startDate || "",
      endDate: endDate || "",
    });
  }, [search, type, branchType, clientId, startDate, endDate, reset]);

  const onSubmit = (data: SearchCampaignValues) => {
    onApplyFilters(data);
  };

  const handleClearFilters = () => {
    const resetValues = {
      search: "",
      type: undefined,
      branchType: undefined,
      clientId: "",
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
              <FormTextField
                control={control}
                errors={errors}
                name="search"
                textFieldProps={{
                  label: "Buscar campanha",
                  variant: "outlined",
                }}
              />
            </Box>

            <Box sx={{ flex: "1 1 200px", minWidth: { xs: "100%", sm: 200 } }}>
              <Controller
                name="type"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth error={!!error}>
                    <InputLabel>Tipo</InputLabel>
                    <Select
                      {...field}
                      value={field.value || ""}
                      label="Tipo"
                      variant="outlined"
                    >
                      <MenuItem value="">
                        <em>Todos os tipos</em>
                      </MenuItem>
                      <MenuItem value="MKT">Marketing</MenuItem>
                      <MenuItem value="SALES">Vendas</MenuItem>
                      <MenuItem value="RETENTION">Retenção</MenuItem>
                      <MenuItem value="UPSELL">Upsell</MenuItem>
                    </Select>
                    {error && <FormHelperText>{error.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Box>

            <Box sx={{ flex: "1 1 200px", minWidth: { xs: "100%", sm: 200 } }}>
              <Controller
                name="branchType"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth error={!!error}>
                    <InputLabel>Filial</InputLabel>
                    <Select
                      {...field}
                      value={field.value || ""}
                      label="Filial"
                      variant="outlined"
                    >
                      <MenuItem value="">
                        <em>Todas as filiais</em>
                      </MenuItem>
                      <MenuItem value="MATRIZ">Matriz</MenuItem>
                      <MenuItem value="FILIAL">Filial</MenuItem>
                    </Select>
                    {error && <FormHelperText>{error.message}</FormHelperText>}
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
