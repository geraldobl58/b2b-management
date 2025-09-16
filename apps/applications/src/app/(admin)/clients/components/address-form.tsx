"use client";

import {
  Controller,
  Control,
  FieldErrors,
  UseFormSetValue,
  UseFormSetError,
  UseFormClearErrors,
} from "react-hook-form";
import { TextField } from "@mui/material";
import { FormClientValues } from "@/schemas/client";
import { CepInput } from "./cep-input";

interface AddressFormProps {
  index: number;
  isAutoFilled: boolean;
  control: Control<FormClientValues>;
  errors: FieldErrors<FormClientValues>;
  setValue: UseFormSetValue<FormClientValues>;
  setError: UseFormSetError<FormClientValues>;
  clearErrors: UseFormClearErrors<FormClientValues>;
  onAddressFilled: (index: number, filled: boolean) => void;
}

export const AddressForm = ({
  index,
  isAutoFilled,
  control,
  errors,
  setValue,
  setError,
  clearErrors,
  onAddressFilled,
}: AddressFormProps) => {
  return (
    <div className="grid grid-cols-4 gap-4 items-start">
      <CepInput
        name={`addresses.${index}.zipcode` as const}
        addressIndex={index}
        control={control}
        setValue={setValue}
        setError={setError}
        clearErrors={clearErrors}
        errors={errors}
        onAddressFilled={onAddressFilled}
      />

      <Controller
        name={`addresses.${index}.street` as const}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Rua"
            variant="outlined"
            error={!!errors.addresses?.[index]?.street}
            helperText={errors.addresses?.[index]?.street?.message}
            disabled={isAutoFilled}
          />
        )}
      />

      <Controller
        name={`addresses.${index}.number` as const}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Número"
            variant="outlined"
            error={!!errors.addresses?.[index]?.number}
            helperText={errors.addresses?.[index]?.number?.message}
          />
        )}
      />

      <Controller
        name={`addresses.${index}.complement` as const}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Complemento"
            variant="outlined"
            error={!!errors.addresses?.[index]?.complement}
            helperText={errors.addresses?.[index]?.complement?.message}
          />
        )}
      />

      <Controller
        name={`addresses.${index}.district` as const}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Bairro"
            variant="outlined"
            error={!!errors.addresses?.[index]?.district}
            helperText={errors.addresses?.[index]?.district?.message}
            disabled={isAutoFilled}
          />
        )}
      />

      <Controller
        name={`addresses.${index}.city` as const}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Cidade"
            variant="outlined"
            error={!!errors.addresses?.[index]?.city}
            helperText={errors.addresses?.[index]?.city?.message}
            disabled={isAutoFilled}
          />
        )}
      />

      <Controller
        name={`addresses.${index}.state` as const}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Estado"
            variant="outlined"
            error={!!errors.addresses?.[index]?.state}
            helperText={errors.addresses?.[index]?.state?.message}
            slotProps={{ htmlInput: { maxLength: 2 } }}
            disabled={isAutoFilled}
          />
        )}
      />
    </div>
  );
};
