"use client";

import {
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";

export interface BasicDataStepProps {
  data?: {
    name?: string;
    startDate?: string;
    endDate?: string;
    city?: string;
    type?: "MKT" | "SALES" | "RETENTION" | "UPSELL";
    branchType?: "MATRIZ" | "FILIAL";
    observations?: string;
  };
  onChange?: (data: any) => void;
}

export const BasicDataStep = ({ data, onChange }: BasicDataStepProps) => {
  const [formData, setFormData] = useState({
    name: data?.name || "",
    startDate: data?.startDate || "",
    endDate: data?.endDate || "",
    city: data?.city || "",
    type: data?.type || "" as "MKT" | "SALES" | "RETENTION" | "UPSELL" | "",
    branchType: data?.branchType || "" as "MATRIZ" | "FILIAL" | "",
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
        city: data.city || "",
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

  // Função para formatar data para input date
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

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

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nome da Campanha"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              error={!formData.name.trim()}
              helperText={!formData.name.trim() ? "Nome da campanha é obrigatório" : ""}
            />
          </Grid>

          <Grid item xs={12} md={6}>
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
          </Grid>

          <Grid item xs={12} md={6}>
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
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Cidade"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              required
              error={!formData.city.trim()}
              helperText={!formData.city.trim() ? "Cidade é obrigatória" : ""}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            {/* Campo vazio para alinhamento */}
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Data de Início"
              type="date"
              value={formatDateForInput(formData.startDate)}
              onChange={(e) => handleChange("startDate", e.target.value)}
              required
              error={!formData.startDate}
              helperText={!formData.startDate ? "Data de início é obrigatória" : ""}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: new Date().toISOString().split('T')[0], // Não permitir datas passadas
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Data de Fim"
              type="date"
              value={formatDateForInput(formData.endDate)}
              onChange={(e) => handleChange("endDate", e.target.value)}
              required
              error={!formData.endDate || !isEndDateValid()}
              helperText={
                !formData.endDate
                  ? "Data de fim é obrigatória"
                  : !isEndDateValid()
                    ? "Data de fim deve ser maior ou igual à data de início"
                    : ""
              }
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: formData.startDate || new Date().toISOString().split('T')[0],
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observações"
              multiline
              rows={4}
              value={formData.observations}
              onChange={(e) => handleChange("observations", e.target.value)}
              placeholder="Adicione observações sobre a campanha (opcional)"
              inputProps={{
                maxLength: 1000,
              }}
              helperText={`${formData.observations.length}/1000 caracteres`}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};