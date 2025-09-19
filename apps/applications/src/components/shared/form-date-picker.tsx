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
      render={({ field }) => (
        <DatePicker
          label={datePickerProps.label}
          value={field.value ? dayjs(field.value) : null}
          onChange={(newValue: dayjs.Dayjs | null) => {
            const formattedDate =
              newValue && newValue.isValid() ? newValue.toISOString() : "";
            field.onChange(formattedDate);
          }}
          disabled={isLoading || datePickerProps.disabled}
          minDate={
            datePickerProps.minDate ? dayjs(datePickerProps.minDate) : undefined
          }
          maxDate={
            datePickerProps.maxDate ? dayjs(datePickerProps.maxDate) : undefined
          }
          slotProps={{
            textField: {
              fullWidth: datePickerProps.fullWidth ?? true,
              error: !!fieldError,
              helperText: fieldError?.message as string,
              size: "small",
              sx: {
                "& .MuiInputBase-root": {
                  borderRadius: "12px",
                  backgroundColor: "#f9f9f9",
                },
                "& input": {
                  fontSize: "14px",
                },
              },
            },
            popper: {
              sx: {
                "& .MuiPaper-root": {
                  borderRadius: "16px",
                  boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
                },
                "& .MuiPickersDay-root": {
                  fontWeight: "500",
                  "&.Mui-selected": {
                    backgroundColor: "#1976d2",
                    color: "#fff",
                  },
                  "&:hover": {
                    backgroundColor: "#e3f2fd",
                  },
                },
              },
            },
          }}
        />
      )}
    />
  );
};
