"use client";

import { Controller, FieldValues, FieldPath } from "react-hook-form";
import { TextField, TextFieldProps } from "@mui/material";
import { BaseFormFieldProps } from "./types";

interface FormTextFieldProps<TFormValues extends FieldValues>
  extends BaseFormFieldProps<TFormValues> {
  name: FieldPath<TFormValues>;
  textFieldProps: Omit<TextFieldProps, "name" | "error" | "helperText">;
}

/**
 * Componente genérico de TextField para formulários
 * Centraliza a lógica comum do Controller + TextField
 */
export const FormTextField = <TFormValues extends FieldValues>({
  control,
  errors,
  name,
  textFieldProps,
  isLoading,
}: FormTextFieldProps<TFormValues>) => {
  const fieldError = errors[name];

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          {...textFieldProps}
          error={!!fieldError}
          helperText={fieldError?.message as string}
          disabled={isLoading || textFieldProps.disabled}
          fullWidth={textFieldProps.fullWidth ?? true}
          size={textFieldProps.size ?? "small"}
        />
      )}
    />
  );
};
