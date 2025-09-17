"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { formClientSchema, FormClientValues } from "@/schemas/client";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { cnpjMask } from "@/lib/masks";
import { PhoneForm } from "./phone-form";
import { AddressForm } from "./address-form";
import { useClient } from "@/hooks/use-client";

interface ClientFormProps {
  onSuccess?: () => void;
}

export const ClientForm = ({ onSuccess }: ClientFormProps) => {
  const { createClient, isLoading, createClientError } = useClient();

  // Track previous loading state to detect completion
  const prevIsLoadingRef = useRef(false);

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormClientValues>({
    resolver: zodResolver(formClientSchema),
    defaultValues: {
      cnpj: "",
      companyName: "",
      fantasyName: "",
      taxpayerType: "SIMPLES_NACIONAL",
      stateRegistration: "",
      typeRelationship: "",
      phones: [{ type: "LANDLINE", number: "" }],
      addresses: [
        {
          zipcode: "",
          street: "",
          number: "",
          complement: "",
          district: "",
          city: "",
          state: "",
        },
      ],
    },
  });

  // Handle success callback
  useEffect(() => {
    // Check if we just finished loading (was loading, now not loading) and no error
    if (onSuccess && prevIsLoadingRef.current && !isLoading && !createClientError) {
      onSuccess();
    }

    // Update previous loading state
    prevIsLoadingRef.current = isLoading;
  }, [onSuccess, isLoading, createClientError]);

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({ control, name: "phones" });

  const { fields: addressFields } = useFieldArray({
    control,
    name: "addresses",
  });

  // track which address indices were auto-filled from CEP so we can disable those fields
  const [addressAutoFilled, setAddressAutoFilled] = useState<
    Record<number, boolean>
  >({});

  const handleCancel = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      reset({
        cnpj: "",
        companyName: "",
        fantasyName: "",
        taxpayerType: "SIMPLES_NACIONAL",
        stateRegistration: "",
        typeRelationship: "",
        phones: [{ type: "LANDLINE", number: "" }],
        addresses: [
          {
            zipcode: "",
            street: "",
            number: "",
            complement: "",
            district: "",
            city: "",
            state: "",
          },
        ],
      });
    }
  };

  const onSubmit = (data: FormClientValues) => {
    createClient(data);
  };

  return (
    <Box className="w-full">
      <Paper
        elevation={3}
        sx={{ display: "block", width: "100%" }}
        className="w-full max-w-full p-4 shadow-md rounded-md space-y-6"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Box className="flex items-center gap-8">
            <Controller
              name="cnpj"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="CNPJ"
                  variant="outlined"
                  placeholder="XX.XXX.XXX/XXXX-XX"
                  error={!!errors.cnpj}
                  helperText={errors.cnpj?.message}
                  onChange={(e) => {
                    const maskedValue = cnpjMask(e.target.value);
                    field.onChange(maskedValue);
                  }}
                  slotProps={{ htmlInput: { maxLength: 18 } }}
                />
              )}
            />
            <Controller
              name="companyName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Empresa"
                  variant="outlined"
                  error={!!errors.companyName}
                  helperText={errors.companyName?.message}
                />
              )}
            />
            <Controller
              name="fantasyName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Nome Fantasia"
                  variant="outlined"
                  error={!!errors.fantasyName}
                  helperText={errors.fantasyName?.message}
                />
              )}
            />
          </Box>

          <Box className="flex items-center gap-8">
            <Controller
              name="taxpayerType"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.taxpayerType}>
                  <InputLabel id="taxpayer-type-label">
                    Tipo de Contribuinte
                  </InputLabel>
                  <Select
                    labelId="taxpayer-type-label"
                    id="taxpayer-type-select"
                    value={field.value}
                    label="Tipo de Contribuinte"
                    onChange={field.onChange}
                  >
                    <MenuItem value="INSENTO">Insento</MenuItem>
                    <MenuItem value="MEI">Mei</MenuItem>
                    <MenuItem value="SIMPLES_NACIONAL">
                      Simples Nacional
                    </MenuItem>
                    <MenuItem value="LUCRO_PRESUMIDO">Lucro Presumido</MenuItem>
                    <MenuItem value="LUCRO_REAL">Lucro Real</MenuItem>
                  </Select>
                  {errors.taxpayerType && (
                    <FormHelperText>
                      {errors.taxpayerType?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <Controller
              name="stateRegistration"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Inscrição Estadual (Opcional)"
                  variant="outlined"
                  error={!!errors.stateRegistration}
                  helperText={errors.stateRegistration?.message}
                />
              )}
            />
            <Controller
              name="typeRelationship"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Tipo de Relacionamento (Opcional)"
                  variant="outlined"
                  error={!!errors.typeRelationship}
                  helperText={errors.typeRelationship?.message}
                />
              )}
            />
          </Box>

          <Box>
            <Divider />
          </Box>

          <Box className="flex flex-col gap-4 mt-4">
            {phoneFields.map((phone, idx) => (
              <PhoneForm
                key={phone.id}
                index={idx}
                phoneType={phone.type}
                control={control}
                errors={errors}
                onRemove={removePhone}
                showRemoveButton={phoneFields.length > 1}
              />
            ))}

            <Box>
              <Button
                type="button"
                variant="outlined"
                onClick={() => appendPhone({ type: "LANDLINE", number: "" })}
              >
                Adicionar Telefone
              </Button>
            </Box>
          </Box>

          <Box>
            <Divider />
          </Box>

          <Box className="space-y-4">
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
                onAddressFilled={(index: number, filled: boolean) => {
                  setAddressAutoFilled((prev) => ({
                    ...prev,
                    [index]: filled,
                  }));
                }}
              />
            ))}
          </Box>

          {createClientError && (
            <Box className="mb-4 p-3 border border-red-300 rounded-md bg-red-50">
              <Typography color="error" variant="body2" className="font-medium">
                {createClientError}
              </Typography>
              {createClientError.includes("CNPJ") && (
                <Typography variant="caption" color="error" className="mt-1 block">
                  Verifique se o CNPJ está correto ou se já não existe um cliente cadastrado com este CNPJ.
                </Typography>
              )}
            </Box>
          )}

          <Box className="flex gap-4 mt-4">
            <Button
              type="submit"
              variant="contained"
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar Cliente"}
            </Button>
            <Button
              type="button"
              variant="contained"
              color="error"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};
