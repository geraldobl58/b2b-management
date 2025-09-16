"use client";

import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import type { FieldPath, Path } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { formClientSchema, FormClientValues } from "@/schemas/client";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { cnpjMask, phoneMask, cepMask } from "@/lib/masks";

export const ClientForm = () => {
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

  // watch phones array to get current type per index (LANDLINE / MOBILE)
  const watchedPhones = useWatch({
    control,
    name: "phones",
    defaultValue: phoneFields,
  });

  const handleCancel = () => {
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
  };

  const onSubmit = (data: FormClientValues) => {
    console.log(data);
  };

  return (
    <div className="w-full">
      <Paper
        elevation={3}
        sx={{ display: "block", width: "100%" }}
        className="w-full max-w-full p-4 shadow-md rounded-md space-y-6"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Box>
            <Typography variant="body2">Dados do cliente</Typography>
            <Typography variant="body1">Gerenciamento de Clientes</Typography>
          </Box>
          <div className="flex items-center gap-8">
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
                  inputProps={{ maxLength: 18 }}
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
          </div>

          <div>
            <Box>
              <Typography variant="body2">Dados de contato</Typography>
              <Typography variant="body1">
                Preencha os campos abaixo:
              </Typography>
            </Box>
            <div className="flex flex-col gap-4 mt-4">
              {phoneFields.map((phone, idx) => (
                <div key={phone.id} className="flex items-center gap-4">
                  <Controller
                    name={`phones.${idx}.type` as const}
                    control={control}
                    render={({ field }) => (
                      <FormControl sx={{ minWidth: 140 }}>
                        <InputLabel id={`phone-type-label-${idx}`}>
                          Tipo
                        </InputLabel>
                        <Select
                          labelId={`phone-type-label-${idx}`}
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
                    name={`phones.${idx}.number` as const}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Número"
                        variant="outlined"
                        error={!!errors.phones?.[idx]?.number}
                        helperText={errors.phones?.[idx]?.number?.message}
                        onChange={(e) =>
                          field.onChange(phoneMask(e.target.value))
                        }
                        inputProps={{
                          maxLength:
                            watchedPhones?.[idx]?.type === "MOBILE" ? 15 : 14,
                        }}
                      />
                    )}
                  />

                  <Button
                    type="button"
                    color="error"
                    onClick={() => removePhone(idx)}
                    size="small"
                  >
                    Remover
                  </Button>
                </div>
              ))}

              <div>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => appendPhone({ type: "LANDLINE", number: "" })}
                >
                  Adicionar Telefone
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Box className="space-y-4">
              <Typography variant="body2">Endereços</Typography>
              {addressFields.map((addr, aidx) => (
                <div
                  key={addr.id}
                  className="grid grid-cols-3 gap-4 items-start"
                >
                  <Controller
                    name={`addresses.${aidx}.zipcode` as const}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="CEP"
                        variant="outlined"
                        error={!!errors.addresses?.[aidx]?.zipcode}
                        helperText={errors.addresses?.[aidx]?.zipcode?.message}
                        onChange={(e) => {
                          // when user edits CEP, clear auto-filled state for this index
                          setAddressAutoFilled((s) => ({
                            ...s,
                            [aidx]: false,
                          }));
                          field.onChange(cepMask(e.target.value));
                        }}
                        onBlur={async () => {
                          const digits = (field.value || "").replace(/\D/g, "");
                          if (digits.length !== 8) return;
                          try {
                            const res = await fetch(
                              `https://viacep.com.br/ws/${digits}/json/`
                            );
                            if (!res.ok) throw new Error("CEP fetch failed");
                            const data = await res.json();
                            if (data.erro) {
                              const name =
                                `addresses.${aidx}.zipcode` as unknown as FieldPath<FormClientValues>;
                              setError(name, {
                                type: "manual",
                                message: "CEP não encontrado",
                              });
                              return;
                            }
                            // populate fields from ViaCEP
                            const streetName =
                              `addresses.${aidx}.street` as unknown as Path<FormClientValues>;
                            const districtName =
                              `addresses.${aidx}.district` as unknown as Path<FormClientValues>;
                            const cityName =
                              `addresses.${aidx}.city` as unknown as Path<FormClientValues>;
                            const stateName =
                              `addresses.${aidx}.state` as unknown as Path<FormClientValues>;
                            setValue(streetName, data.logradouro || "");
                            setValue(districtName, data.bairro || "");
                            setValue(cityName, data.localidade || "");
                            setValue(stateName, (data.uf || "").toUpperCase());
                            const zipName =
                              `addresses.${aidx}.zipcode` as unknown as FieldPath<FormClientValues>;
                            clearErrors(zipName);
                            setAddressAutoFilled((s) => ({
                              ...s,
                              [aidx]: true,
                            }));
                          } catch {
                            const name =
                              `addresses.${aidx}.zipcode` as unknown as FieldPath<FormClientValues>;
                            setError(name, {
                              type: "manual",
                              message: "Erro ao buscar CEP",
                            });
                          }
                        }}
                      />
                    )}
                  />

                  <Controller
                    name={`addresses.${aidx}.street` as const}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Rua"
                        variant="outlined"
                        error={!!errors.addresses?.[aidx]?.street}
                        helperText={errors.addresses?.[aidx]?.street?.message}
                        disabled={!!addressAutoFilled[aidx]}
                      />
                    )}
                  />

                  <Controller
                    name={`addresses.${aidx}.number` as const}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Número"
                        variant="outlined"
                        error={!!errors.addresses?.[aidx]?.number}
                        helperText={errors.addresses?.[aidx]?.number?.message}
                      />
                    )}
                  />

                  <Controller
                    name={`addresses.${aidx}.complement` as const}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Complemento"
                        variant="outlined"
                        error={!!errors.addresses?.[aidx]?.complement}
                        helperText={
                          errors.addresses?.[aidx]?.complement?.message
                        }
                      />
                    )}
                  />

                  <Controller
                    name={`addresses.${aidx}.district` as const}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Bairro"
                        variant="outlined"
                        error={!!errors.addresses?.[aidx]?.district}
                        helperText={errors.addresses?.[aidx]?.district?.message}
                        disabled={!!addressAutoFilled[aidx]}
                      />
                    )}
                  />

                  <Controller
                    name={`addresses.${aidx}.city` as const}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Cidade"
                        variant="outlined"
                        error={!!errors.addresses?.[aidx]?.city}
                        helperText={errors.addresses?.[aidx]?.city?.message}
                        disabled={!!addressAutoFilled[aidx]}
                      />
                    )}
                  />

                  <Controller
                    name={`addresses.${aidx}.state` as const}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Estado"
                        variant="outlined"
                        error={!!errors.addresses?.[aidx]?.state}
                        helperText={errors.addresses?.[aidx]?.state?.message}
                        inputProps={{ maxLength: 2 }}
                        disabled={!!addressAutoFilled[aidx]}
                      />
                    )}
                  />
                </div>
              ))}
            </Box>

            <div className="flex gap-4 mt-4">
              <Button type="submit" variant="contained">
                Salvar
              </Button>
              <Button
                type="button"
                variant="contained"
                color="error"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </form>
      </Paper>
    </div>
  );
};
