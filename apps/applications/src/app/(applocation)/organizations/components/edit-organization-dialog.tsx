"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import { FormDialog } from "@/components/common";
import { useOrganization } from "@/hooks/use-organization";
import {
  formOrganizationSchema,
  OrganizationFormValues,
} from "@/schemas/organization";

interface EditOrganizationDialogProps {
  open: boolean;
  onClose: () => void;
  organizationData: {
    id: string;
    name: string;
    slug: string;
    domain: string;
    industry: string;
    companySize: string;
    timezone: string;
  } | null;
}

export const EditOrganizationDialog = ({
  open,
  onClose,
  organizationData,
}: EditOrganizationDialogProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<OrganizationFormValues>({
    resolver: zodResolver(formOrganizationSchema),
    defaultValues: {
      name: "",
      slug: "",
      domain: "",
      industry: "",
      companySize: "",
      timezone: "",
    },
  });

  const { updateOrganization, isUpdating, updateOrganizationError } =
    useOrganization({
      onUpdateSuccess: () => {
        onClose();
      },
    });

  // Reset form when organization data changes
  useEffect(() => {
    if (organizationData && open) {
      reset({
        name: organizationData.name,
        slug: organizationData.slug,
        domain: organizationData.domain || "",
        industry: organizationData.industry || "",
        companySize: organizationData.companySize || "",
        timezone: organizationData.timezone || "",
      });
    }
  }, [organizationData, open, reset]);

  const onSubmit = (data: OrganizationFormValues) => {
    if (organizationData?.id) {
      updateOrganization({
        organizationId: organizationData.id,
        data,
      });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!organizationData) {
    return null;
  }

  return (
    <FormDialog
      open={open}
      onClose={handleClose}
      title="Editar Organização"
      mode="edit"
      onSubmit={handleSubmit(onSubmit)}
      submitText="Salvar Alterações"
      cancelText="Cancelar"
      maxWidth="md"
      isLoading={isUpdating}
      hasErrors={Object.keys(errors).length > 0}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          fullWidth
          label="Nome da Organização"
          placeholder="Ex: ACME Corporation"
          margin="normal"
          helperText={errors.name?.message}
          error={!!errors.name}
          disabled={isUpdating}
          {...register("name")}
        />
        
        <TextField
          fullWidth
          label="Slug da Organização"
          placeholder="Ex: acme-corporation"
          margin="normal"
          helperText={errors.slug?.message}
          error={!!errors.slug}
          disabled={isUpdating}
          {...register("slug")}
        />

        <TextField
          fullWidth
          label="Domínio"
          placeholder="Ex: acme.com"
          margin="normal"
          helperText={errors.domain?.message}
          error={!!errors.domain}
          disabled={isUpdating}
          {...register("domain")}
        />

        <Controller
          name="industry"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth margin="normal">
              <InputLabel id="edit-select-sector-label">Setor</InputLabel>
              <Select
                labelId="edit-select-sector-label"
                id="edit-select-sector"
                label="Setor"
                value={field.value || ""}
                onChange={field.onChange}
                error={!!errors.industry}
                disabled={isUpdating}
              >
                <MenuItem value="TECNOLOGIA">Tecnologia</MenuItem>
                <MenuItem value="SAAS">SaaS</MenuItem>
                <MenuItem value="ECOMMERCE">E-commerce</MenuItem>
                <MenuItem value="SAUDE">Saúde</MenuItem>
                <MenuItem value="FINANCEIRO">Financeiro</MenuItem>
                <MenuItem value="EDUCACAO">Educação</MenuItem>
                <MenuItem value="OUTRO">Outro</MenuItem>
              </Select>
              {errors.industry && (
                <FormHelperText error>
                  {errors.industry.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />

        <Controller
          name="companySize"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth margin="normal">
              <InputLabel id="edit-select-size-label">Tamanho</InputLabel>
              <Select
                labelId="edit-select-size-label"
                id="edit-select-size"
                label="Tamanho"
                value={field.value || ""}
                onChange={field.onChange}
                error={!!errors.companySize}
                disabled={isUpdating}
              >
                <MenuItem value="1-10">1-10 funcionários</MenuItem>
                <MenuItem value="11-50">11-50 funcionários</MenuItem>
                <MenuItem value="51-200">51-200 funcionários</MenuItem>
                <MenuItem value="201-500">201-500 funcionários</MenuItem>
                <MenuItem value="500+">500+ funcionários</MenuItem>
              </Select>
              {errors.companySize && (
                <FormHelperText error>
                  {errors.companySize.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />

        <Controller
          name="timezone"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth margin="normal">
              <InputLabel id="edit-select-timezone-label">Fuso Horário</InputLabel>
              <Select
                labelId="edit-select-timezone-label"
                id="edit-select-timezone"
                label="Fuso Horário"
                value={field.value || ""}
                onChange={field.onChange}
                error={!!errors.timezone}
                disabled={isUpdating}
              >
                <MenuItem value="America/New_York">America/New_York</MenuItem>
                <MenuItem value="America/Denver">America/Denver</MenuItem>
                <MenuItem value="America/Chicago">America/Chicago</MenuItem>
                <MenuItem value="America/Sao_Paulo">
                  America/Sao_Paulo
                </MenuItem>
                <MenuItem value="Europe/London">Europe/London</MenuItem>
              </Select>
              {errors.timezone && (
                <FormHelperText error>
                  {errors.timezone.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
      </div>

      {updateOrganizationError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">
            {updateOrganizationError}
          </p>
        </div>
      )}
    </FormDialog>
  );
};