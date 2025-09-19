"use client";

import { FormContractValues } from "@/features/contracts/schemas/contract";
import { BaseFormFieldProps } from "@/components/shared";
import { FormTextField } from "@/components/shared";

export const ContractBasicFields = ({
  control,
  errors,
  isLoading,
}: BaseFormFieldProps<FormContractValues>) => {
  return (
    <>
      <FormTextField
        control={control}
        errors={errors}
        name="name"
        isLoading={isLoading}
        textFieldProps={{
          label: "Nome do Contrato",
        }}
      />

      <FormTextField
        control={control}
        errors={errors}
        name="partner"
        isLoading={isLoading}
        textFieldProps={{
          label: "Parceiro",
        }}
      />
    </>
  );
};
