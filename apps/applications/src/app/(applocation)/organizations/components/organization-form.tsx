"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useOrganization } from "@/hooks/use-organization";
import { useMounted } from "@/hooks/use-mounted";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  formOrganizationSchema,
  OrganizationFormValues,
} from "@/schemas/organization";

export const OrganizationForm = () => {
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

  const { isLoading, createOrganization, createOrganizationError } =
    useOrganization(() => {
      // Limpa os campos quando a organização é criada com sucesso
      reset({
        name: "",
        slug: "",
        domain: "",
        industry: "",
        companySize: "",
        timezone: "",
      });
    });
  const mounted = useMounted();

  const onSubmit = (data: OrganizationFormValues) => {
    createOrganization(data);
  };

  // Renderização simples durante hidratação
  if (!mounted) {
    return (
      <div className="w-full p-4 bg-white shadow-md rounded-md space-y-4">
        <div>
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            Organizações
          </Typography>
          <Typography sx={{ marginBottom: 2 }}>
            Esta é a página de organizações. Aqui você pode visualizar
            informações detalhadas sobre as organizações da sua conta.
          </Typography>
        </div>
        <div className="flex items-center justify-center py-8">
          <Typography variant="body2" color="text.secondary">
            Carregando formulário...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-white shadow-md rounded-md space-y-4">
      <div>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Organizações
        </Typography>
        <Typography sx={{ marginBottom: 2 }}>
          Esta é a página de organizações. Aqui você pode visualizar informações
          detalhadas sobre as organizações da sua conta.
        </Typography>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-center gap-8">
          <TextField
            fullWidth
            label="Nome da Organização"
            placeholder="Ex: ACME Corporation"
            margin="normal"
            helperText={errors.name?.message}
            error={!!errors.name}
            {...register("name")}
          />
          <TextField
            fullWidth
            label="Slug da Organização"
            placeholder="Ex: acme-corporation"
            margin="normal"
            helperText={errors.slug?.message}
            error={!!errors.slug}
            {...register("slug")}
          />
          <TextField
            fullWidth
            label="Domínio"
            placeholder="Ex: acme.com"
            margin="normal"
            helperText={errors.domain?.message}
            error={!!errors.domain}
            {...register("domain")}
          />
          <Controller
            name="industry"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel id="select-sector-label">Setor</InputLabel>
                <Select
                  labelId="select-sector-label"
                  id="select-sector-label"
                  label="Setor"
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={!!errors.industry}
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
                <InputLabel id="select-size-label">Tamanho</InputLabel>
                <Select
                  labelId="select-size-label"
                  id="select-size-label"
                  label="Tamanho"
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={!!errors.companySize}
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
                <InputLabel id="select-timezone-label">Fuso Horário</InputLabel>
                <Select
                  labelId="select-timezone-label"
                  id="select-timezone-label"
                  label="Fuso Horário"
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={!!errors.timezone}
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

        <div className="flex items-center gap-4 mt-4">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? "Criando..." : "Criar Organização"}
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            onClick={() => {
              reset({
                name: "",
                slug: "",
                domain: "",
                industry: "",
                companySize: "",
                timezone: "",
              });
            }}
          >
            Cancelar Ação
          </Button>
        </div>
      </form>

      {createOrganizationError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <Typography color="error" variant="body2">
            {createOrganizationError}
          </Typography>
        </div>
      )}
    </div>
  );
};
