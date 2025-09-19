"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { Search, X } from "lucide-react";

import { Box, Button, Paper, Stack } from "@mui/material";

import {
  searchContractSchema,
  SearchContractValues,
} from "@/features/contracts/schemas/search-contract";
import {
  DatePickerProvider,
  FormTextField,
  FormDateRange,
} from "@/components/shared";

interface ContractFiltersProps {
  name?: string;
  partner?: string;
  clientName?: string;
  startDate?: string;
  endDate?: string;
  onApplyFilters: (data: SearchContractValues) => void;
  onClearFilters: () => void;
}

export const ContractFilters = ({
  name,
  partner,
  clientName,
  startDate,
  endDate,
  onApplyFilters,
  onClearFilters,
}: ContractFiltersProps) => {
  const {
    reset,
    control,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm<SearchContractValues>({
    resolver: zodResolver(searchContractSchema),
    defaultValues: {
      name: "",
      partner: "",
      clientName: "",
      startDate: "",
      endDate: "",
    },
  });

  // Watch startDate for validation
  const watchedStartDate = watch("startDate");

  // Sync form with props when URL params change
  useEffect(() => {
    reset({
      name: name || "",
      partner: partner || "",
      clientName: clientName || "",
      startDate: startDate || "",
      endDate: endDate || "",
    });
  }, [name, partner, clientName, startDate, endDate, reset]);

  const onSubmit = (data: SearchContractValues) => {
    onApplyFilters(data);
  };

  const handleClearFilters = () => {
    const resetValues = {
      name: "",
      partner: "",
      clientName: "",
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
                name="clientName"
                textFieldProps={{
                  label: "Nome do cliente",
                  variant: "outlined",
                }}
              />
            </Box>
            <Box sx={{ flex: "1 1 240px", minWidth: { xs: "100%", sm: 240 } }}>
              <FormTextField
                control={control}
                errors={errors}
                name="name"
                textFieldProps={{
                  label: "Nome do contrato",
                  variant: "outlined",
                }}
              />
            </Box>

            <Box sx={{ flex: "1 1 240px", minWidth: { xs: "100%", sm: 240 } }}>
              <FormTextField
                control={control}
                errors={errors}
                name="partner"
                textFieldProps={{
                  label: "Nome do parceiro",
                  variant: "outlined",
                }}
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
