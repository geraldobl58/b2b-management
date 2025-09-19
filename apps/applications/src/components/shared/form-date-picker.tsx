"use client";

import { Controller, FieldValues, FieldPath } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { BaseFormFieldProps, DatePickerFieldProps } from "./types";

interface FormDatePickerProps<TFormValues extends FieldValues>
  extends BaseFormFieldProps<TFormValues> {
  name: FieldPath<TFormValues>;
  datePickerProps: DatePickerFieldProps;
}

/**
 * Componente genérico de DatePicker para formulários
 * Centraliza a lógica comum do Controller + DatePicker
 */
export const FormDatePicker = <TFormValues extends FieldValues>({
  control,
  errors,
  name,
  datePickerProps,
  isLoading,
}: FormDatePickerProps<TFormValues>) => {
  const fieldError = errors[name];

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        // Verificar se o valor é válido antes de passar para dayjs
        const getValue = () => {
          if (!field.value) return null;

          // Se é uma string vazia, retorna null
          if (typeof field.value === "string" && field.value === "")
            return null;

          // Tenta converter qualquer valor para dayjs
          const date = dayjs(field.value);
          return date.isValid() ? date : null;
        };

        return (
          <DatePicker
            label={datePickerProps.label}
            value={getValue()}
            onChange={(newValue: dayjs.Dayjs | null) => {
              if (datePickerProps.outputFormat === "string") {
                // Para filtros - retorna string ISO ou vazia
                const formattedDate =
                  newValue && newValue.isValid() ? newValue.toISOString() : "";
                field.onChange(formattedDate);
              } else {
                // Para formulários - retorna objeto Date ou null
                const formattedDate =
                  newValue && newValue.isValid() ? newValue.toDate() : null;
                field.onChange(formattedDate);
              }
            }}
            disabled={isLoading || datePickerProps.disabled}
            minDate={
              datePickerProps.minDate
                ? dayjs(datePickerProps.minDate)
                : undefined
            }
            maxDate={
              datePickerProps.maxDate
                ? dayjs(datePickerProps.maxDate)
                : undefined
            }
            slotProps={{
              textField: {
                fullWidth: datePickerProps.fullWidth ?? true,
                error: !!fieldError,
                helperText: fieldError?.message as string,
                size: "small",
              },
            }}
          />
        );
      }}
    />
  );
};
