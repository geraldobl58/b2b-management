"use client";

import { FormContractValues } from "@/features/contracts/schemas/contract";
import { BaseFormFieldProps } from "@/components/shared";
import { FormDateRange } from "@/components/shared";

interface DateRangeFieldsProps extends BaseFormFieldProps<FormContractValues> {
  startDate?: Date;
}

export const DateRangeFields = ({
  control,
  errors,
  startDate,
  isLoading,
}: DateRangeFieldsProps) => {
  return (
    <FormDateRange
      control={control}
      errors={errors}
      startDateName="startDate"
      endDateName="endDate"
      startDate={startDate}
      isLoading={isLoading}
      layout="horizontal"
      startDateProps={{
        label: "Data de Início *",
        minDate: new Date(),
      }}
      endDateProps={{
        label: "Data de Término *",
      }}
    />
  );
};
