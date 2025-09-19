import {
  Control,
  FieldErrors,
  UseFormSetValue,
  UseFormSetError,
  UseFormClearErrors,
  UseFieldArrayReturn,
} from "react-hook-form";
import { Box, Typography } from "@mui/material";
import { AddressForm } from "../address-form";
import { FormClientValues } from "@/features/clients/schemas/client";

interface ClientAddressFieldsProps {
  control: Control<FormClientValues>;
  errors: FieldErrors<FormClientValues>;
  setValue: UseFormSetValue<FormClientValues>;
  setError: UseFormSetError<FormClientValues>;
  clearErrors: UseFormClearErrors<FormClientValues>;
  addressFields: UseFieldArrayReturn<
    FormClientValues,
    "addresses",
    "id"
  >["fields"];
  addressAutoFilled: Record<number, boolean>;
  onAddressFilled: (index: number, filled: boolean) => void;
}

export const ClientAddressFields = ({
  control,
  errors,
  setValue,
  setError,
  clearErrors,
  addressFields,
  addressAutoFilled,
  onAddressFilled,
}: ClientAddressFieldsProps) => {
  return (
    <Box className="space-y-4">
      <Typography variant="h6" component="h3" className="text-lg font-semibold">
        Endereços
      </Typography>

      {addressFields.map((addr, aidx) => (
        <AddressForm
          key={addr.id}
          index={aidx}
          isAutoFilled={!!addressAutoFilled[aidx]}
          control={control}
          errors={errors}
          setValue={setValue}
          setError={setError}
          clearErrors={clearErrors}
          onAddressFilled={onAddressFilled}
        />
      ))}
    </Box>
  );
};
