"use client";

import React from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { cnpjMask, phoneMask, cepMask } from "@/lib/masks";

type MaskType = "cnpj" | "phone" | "cep";

interface MaskedInputProps extends Omit<TextFieldProps, "onChange"> {
  mask: MaskType;
  value?: string;
  onChange?: (value: string) => void;
}

const getMaskFunction = (mask: MaskType) => {
  switch (mask) {
    case "cnpj":
      return cnpjMask;
    case "phone":
      return phoneMask;
    case "cep":
      return cepMask;
    default:
      return (value: string) => value;
  }
};

const getMaxLength = (mask: MaskType) => {
  switch (mask) {
    case "cnpj":
      return 18; // XX.XXX.XXX/XXXX-XX
    case "phone":
      return 15; // (XX) XXXXX-XXXX
    case "cep":
      return 9;  // XXXXX-XXX
    default:
      return undefined;
  }
};

const getPlaceholder = (mask: MaskType) => {
  switch (mask) {
    case "cnpj":
      return "XX.XXX.XXX/XXXX-XX";
    case "phone":
      return "(XX) XXXXX-XXXX";
    case "cep":
      return "XXXXX-XXX";
    default:
      return undefined;
  }
};

export const MaskedInput: React.FC<MaskedInputProps> = ({
  mask,
  value = "",
  onChange,
  ...props
}) => {
  const maskFunction = getMaskFunction(mask);
  const maxLength = getMaxLength(mask);
  const placeholder = getPlaceholder(mask);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const maskedValue = maskFunction(rawValue);

    if (onChange) {
      onChange(maskedValue);
    }
  };

  return (
    <TextField
      {...props}
      value={maskFunction(value)}
      onChange={handleChange}
      inputProps={{
        ...props.inputProps,
        maxLength,
      }}
      placeholder={placeholder}
    />
  );
};