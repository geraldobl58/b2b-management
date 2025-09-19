import { Control, FieldErrors, UseFieldArrayReturn } from "react-hook-form";
import { Box, Button, Typography } from "@mui/material";
import { PhoneForm } from "../phone-form";
import { FormClientValues } from "@/features/clients/schemas/client";

interface ClientContactFieldsProps {
  control: Control<FormClientValues>;
  errors: FieldErrors<FormClientValues>;
  phoneFields: UseFieldArrayReturn<FormClientValues, "phones", "id">["fields"];
  onAddPhone: () => void;
  onRemovePhone: (index: number) => void;
}

export const ClientContactFields = ({
  control,
  errors,
  phoneFields,
  onAddPhone,
  onRemovePhone,
}: ClientContactFieldsProps) => {
  return (
    <Box className="space-y-4">
      <Typography variant="h6" component="h3" className="text-lg font-semibold">
        Telefones
      </Typography>

      {phoneFields.map((phone, pidx) => (
        <PhoneForm
          key={phone.id}
          index={pidx}
          phoneType={phone.type}
          control={control}
          errors={errors}
          onRemove={onRemovePhone}
          showRemoveButton={phoneFields.length > 1}
        />
      ))}

      <Box>
        <Button type="button" variant="outlined" onClick={onAddPhone}>
          Adicionar Telefone
        </Button>
      </Box>
    </Box>
  );
};
