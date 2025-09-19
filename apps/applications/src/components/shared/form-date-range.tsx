"use client";

import { FieldValues, FieldPath } from "react-hook-form";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import { BaseFormFieldProps, DateRangeProps } from "./types";
import { FormDatePicker } from "./form-date-picker";

interface FormDateRangeProps<TFormValues extends FieldValues>
  extends BaseFormFieldProps<TFormValues>,
    DateRangeProps {
  startDateName: FieldPath<TFormValues>;
  endDateName: FieldPath<TFormValues>;
}

/**
 * Componente genérico para range de datas
 * Pode ser usado tanto em formulários quanto em filtros
 */
export const FormDateRange = <TFormValues extends FieldValues>({
  control,
  errors,
  startDateName,
  endDateName,
  startDate,
  isLoading,
  layout = "horizontal",
  startDateProps = {},
  endDateProps = {},
  allowPastDates = false, // Por padrão, não permite datas passadas (para formulários)
  outputFormat = "date", // Por padrão, retorna Date objects (para formulários)
}: FormDateRangeProps<TFormValues>) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexDirection:
          layout === "horizontal" ? { xs: "column", sm: "row" } : "column",
      }}
    >
      <FormDatePicker
        control={control}
        errors={errors}
        name={startDateName}
        isLoading={isLoading}
        datePickerProps={{
          label: "Data Inicial",
          minDate: allowPastDates ? undefined : new Date(), // Se permite datas passadas, não define minDate
          fullWidth: true,
          outputFormat,
          ...startDateProps,
        }}
      />

      <FormDatePicker
        control={control}
        errors={errors}
        name={endDateName}
        isLoading={isLoading}
        datePickerProps={{
          label: "Data Final",
          minDate: startDate
            ? dayjs(startDate).add(1, "day").toDate()
            : allowPastDates
              ? undefined // Se permite datas passadas, não define minDate baseada na data atual
              : dayjs().add(1, "day").toDate(),
          fullWidth: true,
          outputFormat,
          ...endDateProps,
        }}
      />
    </Box>
  );
};
