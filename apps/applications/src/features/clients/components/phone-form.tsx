"use client";

import { Controller, Control, FieldErrors } from "react-hook-form";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { phoneMask } from "@/lib/masks";
import { FormClientValues } from "@/features/clients/schemas/client";
import { Trash } from "lucide-react";

interface PhoneFormProps {
  index: number;
  phoneType: "LANDLINE" | "MOBILE";
  control: Control<FormClientValues>;
  errors: FieldErrors<FormClientValues>;
  onRemove: (index: number) => void;
  showRemoveButton?: boolean;
}

export const PhoneForm = ({
  index,
  phoneType,
  control,
  errors,
  onRemove,
  showRemoveButton = true,
}: PhoneFormProps) => {
  const maxLength = phoneType === "MOBILE" ? 15 : 14;

  return (
    <div className="flex items-center gap-4">
      <Controller
        name={`phones.${index}.type` as const}
        control={control}
        render={({ field }) => (
          <FormControl sx={{ minWidth: 140 }}>
            <InputLabel id={`phone-type-label-${index}`}>Tipo</InputLabel>
            <Select
              labelId={`phone-type-label-${index}`}
              value={field.value}
              label="Tipo"
              onChange={field.onChange}
            >
              <MenuItem value="LANDLINE">Fixo</MenuItem>
              <MenuItem value="MOBILE">Celular</MenuItem>
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name={`phones.${index}.number` as const}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Número"
            variant="outlined"
            placeholder={
              phoneType === "MOBILE" ? "(00) 00000-0000" : "(00) 0000-0000"
            }
            error={!!errors.phones?.[index]?.number}
            helperText={errors.phones?.[index]?.number?.message}
            onChange={(e) => field.onChange(phoneMask(e.target.value))}
            slotProps={{ htmlInput: { maxLength } }}
          />
        )}
      />

      {showRemoveButton && (
        <IconButton
          type="button"
          color="error"
          onClick={() => onRemove(index)}
          size="small"
        >
          <Trash />
        </IconButton>
      )}
    </div>
  );
};
