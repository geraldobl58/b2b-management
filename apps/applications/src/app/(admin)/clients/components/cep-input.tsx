"use client";

import {
  Controller,
  Control,
  FieldErrors,
  UseFormSetValue,
  UseFormSetError,
  UseFormClearErrors,
} from "react-hook-form";
import type { FieldPath, Path } from "react-hook-form";
import { TextField } from "@mui/material";
import { cepMask } from "@/lib/masks";
import { FormClientValues } from "@/schemas/client";

interface CepInputProps {
  name: FieldPath<FormClientValues>;
  addressIndex: number;
  control: Control<FormClientValues>;
  setValue: UseFormSetValue<FormClientValues>;
  setError: UseFormSetError<FormClientValues>;
  clearErrors: UseFormClearErrors<FormClientValues>;
  errors: FieldErrors<FormClientValues>;
  onAddressFilled: (index: number, filled: boolean) => void;
}

interface ViaCepResponse {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export const CepInput = ({
  name,
  addressIndex,
  control,
  setValue,
  setError,
  clearErrors,
  errors,
  onAddressFilled,
}: CepInputProps) => {
  const handleCepLookup = async (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);

      if (!response.ok) {
        throw new Error("CEP fetch failed");
      }

      const data: ViaCepResponse = await response.json();

      if (data.erro) {
        setError(name, {
          type: "manual",
          message: "CEP não encontrado",
        });
        return;
      }

      // Populate address fields
      const streetName =
        `addresses.${addressIndex}.street` as Path<FormClientValues>;
      const districtName =
        `addresses.${addressIndex}.district` as Path<FormClientValues>;
      const cityName =
        `addresses.${addressIndex}.city` as Path<FormClientValues>;
      const stateName =
        `addresses.${addressIndex}.state` as Path<FormClientValues>;

      setValue(streetName, data.logradouro || "");
      setValue(districtName, data.bairro || "");
      setValue(cityName, data.localidade || "");
      setValue(stateName, (data.uf || "").toUpperCase());

      clearErrors(name);
      onAddressFilled(addressIndex, true);
    } catch {
      setError(name, {
        type: "manual",
        message: "Erro ao buscar CEP",
      });
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label="CEP"
          variant="outlined"
          placeholder="00000-000"
          error={!!errors.addresses?.[addressIndex]?.zipcode}
          helperText={errors.addresses?.[addressIndex]?.zipcode?.message}
          onChange={(e) => {
            onAddressFilled(addressIndex, false);
            field.onChange(cepMask(e.target.value));
          }}
          onBlur={() => {
            let cep = "";
            if (typeof field.value === "string") {
              cep = field.value;
            } else if (
              field.value &&
              typeof field.value === "object" &&
              "zipcode" in field.value
            ) {
              cep = (field.value as { zipcode?: string }).zipcode || "";
            }
            handleCepLookup(cep);
          }}
          slotProps={{ htmlInput: { maxLength: 9 } }}
        />
      )}
    />
  );
};
