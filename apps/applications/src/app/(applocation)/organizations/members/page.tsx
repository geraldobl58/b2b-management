"use client";

import { useState, FormEvent } from "react";

import { DashboardLayout } from "@/components/layout/app-layout";
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
import { FormDialog } from "@/components/common";
import { ListMembers } from "./components/list-members";

const OrganizationMembersPage = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    role: "VIEWER",
  });
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    role?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    setFormData({ email: "", role: "VIEWER" });
    setFormErrors({});
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ email: "", role: "VIEWER" });
    setFormErrors({});
    setIsLoading(false);
  };

  const validateForm = () => {
    const errors: { email?: string; role?: string } = {};

    if (!formData.email.trim()) {
      errors.email = "E-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "E-mail inválido";
    }

    if (!formData.role) {
      errors.role = "Função é obrigatória";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Simular chamada da API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Adicionando membro:", formData);

      // Sucesso - fechar dialog
      handleClose();

      // Aqui você adicionaria a lógica para atualizar a lista
      // Por exemplo: refetch da lista de membros
    } catch (error) {
      console.error("Erro ao adicionar membro:", error);
      setFormErrors({ email: "Erro ao adicionar membro. Tente novamente." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout title="Gerenciamento completo de membros da organização">
      <div>
        <div className="flex justify-between items-center">
          <div>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
              Membros da Organização
            </Typography>
            <Typography sx={{ marginBottom: 2 }}>
              Esta é a página de membros da organização. Aqui você pode
              visualizar informações detalhadas sobre os membros da sua
              organização.
            </Typography>
          </div>
          <div>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClickOpen}
            >
              Adicionar Membro
            </Button>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <Typography variant="subtitle1">
            Abaixo está a lista de todos os membros associados à sua
            organização.
          </Typography>
        </div>
        <div>
          <ListMembers />
        </div>
      </div>

      <FormDialog
        open={open}
        onClose={handleClose}
        title="Adicionar Novo Membro"
        mode="create"
        onSubmit={handleSubmit}
        submitText="Adicionar Membro"
        cancelText="Cancelar"
        maxWidth="sm"
        isLoading={isLoading}
        hasErrors={Object.keys(formErrors).length > 0}
      >
        <div className="space-y-8">
          <p className="text-gray-600 text-sm mb-4">
            Para adicionar um novo membro, envie um convite por email.
          </p>

          <TextField
            fullWidth
            label="E-mail do Membro"
            placeholder="Ex: membro@exemplo.com"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (formErrors.email) {
                setFormErrors({ ...formErrors, email: undefined });
              }
            }}
            error={!!formErrors.email}
            helperText={formErrors.email || "E-mail do membro a ser adicionado"}
            required
            disabled={isLoading}
          />

          <FormControl fullWidth error={!!formErrors.role}>
            <InputLabel id="select-role-label">Função</InputLabel>
            <Select
              labelId="select-role-label"
              value={formData.role}
              label="Função"
              onChange={(e) => {
                setFormData({ ...formData, role: e.target.value });
                if (formErrors.role) {
                  setFormErrors({ ...formErrors, role: undefined });
                }
              }}
              required
              disabled={isLoading}
            >
              <MenuItem value="VIEWER">Visualizador</MenuItem>
              <MenuItem value="ANALYST">Analista</MenuItem>
              <MenuItem value="MANAGER">Gerente</MenuItem>
              <MenuItem value="ADMIN">Administrador</MenuItem>
              <MenuItem value="OWNER">Proprietário</MenuItem>
            </Select>
            <FormHelperText>
              {formErrors.role || "Selecione uma função para o novo membro"}
            </FormHelperText>
          </FormControl>
        </div>
      </FormDialog>
    </DashboardLayout>
  );
};

export default OrganizationMembersPage;
