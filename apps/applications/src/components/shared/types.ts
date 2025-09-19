import { Control, FieldErrors, FieldValues } from "react-hook-form";

/**
 * Interface base para componentes que recebem control e errors do react-hook-form
 */
export interface BaseFormFieldProps<
  TFormValues extends FieldValues = FieldValues,
> {
  control: Control<TFormValues>;
  errors: FieldErrors<TFormValues>;
  isLoading?: boolean;
}

/**
 * Props para componentes de DatePicker
 */
export interface DatePickerFieldProps {
  label: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  outputFormat?: "date" | "string"; // Para controlar o formato de saída
}

/**
 * Props para componentes de range de datas
 */
export interface DateRangeProps {
  startDateProps?: Partial<DatePickerFieldProps>;
  endDateProps?: Partial<DatePickerFieldProps>;
  startDate?: Date;
  disabled?: boolean;
  layout?: "horizontal" | "vertical";
  allowPastDates?: boolean; // Para filtros, permitir datas passadas
  outputFormat?: "date" | "string"; // Para controlar o formato de saída
}
