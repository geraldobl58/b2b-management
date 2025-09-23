"use client";

import { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DatePickerProvider } from "@/components/shared";

import dayjs from "dayjs";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useClientById } from "@/features/clients/hooks/use-client";

export interface BasicDataStepProps {
  data?: {
    name?: string;
    startDate?: string;
    endDate?: string;
    type?: "MKT" | "SALES" | "RETENTION" | "UPSELL";
    branchType?: "MATRIZ" | "FILIAL";
    observations?: string;
  };
  clientId?: string; // ID do cliente para buscar os dados
  onChange?: (data: {
    name: string;
    startDate: string;
    endDate: string;
    type: "MKT" | "SALES" | "RETENTION" | "UPSELL" | "";
    branchType: "MATRIZ" | "FILIAL" | "";
    observations: string;
  }) => void;
}

export const BasicDataStep = ({
  data,
  clientId,
  onChange,
}: BasicDataStepProps) => {
  // Hooks para buscar dados das APIs
  const { user, isLoading: isLoadingUser } = useAuth();
  const { data: clientData, isLoading: isLoadingClient } = useClientById(
    clientId || ""
  );

  const [formData, setFormData] = useState({
    name: data?.name || "",
    startDate: data?.startDate || "",
    endDate: data?.endDate || "",
    type: data?.type || ("" as "MKT" | "SALES" | "RETENTION" | "UPSELL" | ""),
    branchType: data?.branchType || ("" as "MATRIZ" | "FILIAL" | ""),
    observations: data?.observations || "",
  });

  const handleChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange?.(newData);
  };

  // Atualizar form data quando props mudam
  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        startDate: data.startDate || "",
        endDate: data.endDate || "",
        type: data.type || "",
        branchType: data.branchType || "",
        observations: data.observations || "",
      });
    }
  }, [data]);

  const campaignTypes = [
    { value: "MKT", label: "Marketing" },
    { value: "SALES", label: "Vendas" },
    { value: "RETENTION", label: "Retenção" },
    { value: "UPSELL", label: "Upsell" },
  ];

  const branchTypes = [
    { value: "MATRIZ", label: "Matriz" },
    { value: "FILIAL", label: "Filial" },
  ];

  // Função para validar se data final é maior que inicial
  const isEndDateValid = () => {
    if (!formData.startDate || !formData.endDate) return true;
    return new Date(formData.endDate) >= new Date(formData.startDate);
  };

  return (
    <Card sx={{ mt: 2, mb: 2 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Dados Básicos
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Defina as informações básicas da campanha.
        </Typography>

        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <TextField
              fullWidth
              label="Nome da Campanha"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              error={!formData.name.trim()}
              helperText={
                !formData.name.trim() ? "Nome da campanha é obrigatório" : ""
              }
            />
            <DatePickerProvider>
              <DatePicker
                label="Data de Início"
                value={formData.startDate ? dayjs(formData.startDate) : null}
                onChange={(newValue) => {
                  const dateString =
                    newValue && newValue.isValid()
                      ? newValue.toISOString()
                      : "";
                  handleChange("startDate", dateString);
                }}
                minDate={dayjs()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !formData.startDate,
                    helperText: !formData.startDate
                      ? "Data de início é obrigatória"
                      : "",
                    size: "medium",
                  },
                }}
              />
            </DatePickerProvider>
            <DatePickerProvider>
              <DatePicker
                label="Data de Fim"
                value={formData.endDate ? dayjs(formData.endDate) : null}
                onChange={(newValue) => {
                  const dateString =
                    newValue && newValue.isValid()
                      ? newValue.toISOString()
                      : "";
                  handleChange("endDate", dateString);
                }}
                minDate={
                  formData.startDate ? dayjs(formData.startDate) : dayjs()
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !formData.endDate || !isEndDateValid(),
                    helperText: !formData.endDate
                      ? "Data de fim é obrigatória"
                      : !isEndDateValid()
                        ? "Data de fim deve ser maior ou igual à data de início"
                        : "",
                    size: "medium",
                  },
                }}
              />
            </DatePickerProvider>
          </div>

          <div className="flex items-center justify-between gap-4">
            <FormControl fullWidth required error={!formData.type}>
              <InputLabel>Tipo de Campanha</InputLabel>
              <Select
                value={formData.type}
                label="Tipo de Campanha"
                onChange={(e) => handleChange("type", e.target.value)}
              >
                {campaignTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required error={!formData.branchType}>
              <InputLabel>Tipo de Filial</InputLabel>
              <Select
                value={formData.branchType}
                label="Tipo de Filial"
                onChange={(e) => handleChange("branchType", e.target.value)}
              >
                {branchTypes.map((branch) => (
                  <MenuItem key={branch.value} value={branch.value}>
                    {branch.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div>
            <TextField
              fullWidth
              label="Observações"
              multiline
              rows={4}
              value={formData.observations}
              onChange={(e) => handleChange("observations", e.target.value)}
              placeholder="Adicione observações sobre a campanha (opcional)"
              slotProps={{
                htmlInput: {
                  maxLength: 1000,
                },
              }}
              helperText={`${formData.observations.length}/1000 caracteres`}
            />
          </div>

          <div className="mt-6">
            <Typography variant="h4" gutterBottom>
              Informações do Cliente
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Dados do cliente associado à campanha.
            </Typography>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              {isLoadingClient ? (
                <div className="col-span-2 flex items-center justify-center py-4">
                  <CircularProgress size={24} sx={{ mr: 2 }} />
                  <Typography variant="body2">
                    Carregando dados do cliente...
                  </Typography>
                </div>
              ) : (
                <>
                  <div>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: "bold", color: "text.secondary" }}
                    >
                      CNPJ
                    </Typography>
                    <Typography variant="body1">
                      {clientData?.cnpj || "Não informado"}
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: "bold", color: "text.secondary" }}
                    >
                      Nome Fantasia
                    </Typography>
                    <Typography variant="body1">
                      {clientData?.fantasyName || "Não informado"}
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: "bold", color: "text.secondary" }}
                    >
                      Razão Social
                    </Typography>
                    <Typography variant="body1">
                      {clientData?.companyName || "Não informado"}
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: "bold", color: "text.secondary" }}
                    >
                      Endereço Principal
                    </Typography>
                    <Typography variant="body1">
                      {clientData?.addresses && clientData.addresses.length > 0
                        ? `${clientData.addresses[0].street}, ${clientData.addresses[0].city} - ${clientData.addresses[0].state}`
                        : "Não informado"}
                    </Typography>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-6">
            <Typography variant="h4" gutterBottom>
              Responsável pela Campanha
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Dados do usuário atualmente logado no sistema.
            </Typography>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="mt-2">
                {isLoadingUser ? (
                  <div className="flex items-center">
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Carregando dados do usuário...
                    </Typography>
                  </div>
                ) : (
                  <>
                    <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                      Usuário logado: {user?.name || "Usuário não identificado"}
                    </Typography>
                    {user?.email && (
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    )}
                    {user?.role && (
                      <Typography
                        variant="caption"
                        sx={{
                          backgroundColor: "primary.main",
                          color: "white",
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          display: "inline-block",
                          mt: 1,
                        }}
                      >
                        {user.role}
                      </Typography>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
