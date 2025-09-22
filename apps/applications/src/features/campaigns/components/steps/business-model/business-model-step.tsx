"use client";

import {
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Switch,
  Chip,
  Box
} from "@mui/material";
import { useState } from "react";

export interface BusinessModelStepProps {
  data?: {
    model?: string;
    budget?: number;
    currency?: string;
    autoRenewal?: boolean;
    tags?: string[];
    priority?: string;
  };
  onChange?: (data: any) => void;
}

export const BusinessModelStep = ({ data, onChange }: BusinessModelStepProps) => {
  const [formData, setFormData] = useState({
    model: data?.model || "",
    budget: data?.budget || 0,
    currency: data?.currency || "BRL",
    autoRenewal: data?.autoRenewal || false,
    tags: data?.tags || [],
    priority: data?.priority || "medium",
  });

  const handleChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange?.(newData);
  };

  const businessModels = [
    { value: "subscription", label: "Assinatura" },
    { value: "one-time", label: "Pagamento Único" },
    { value: "freemium", label: "Freemium" },
    { value: "usage-based", label: "Baseado em Uso" },
    { value: "hybrid", label: "Híbrido" },
  ];

  const priorities = [
    { value: "low", label: "Baixa" },
    { value: "medium", label: "Média" },
    { value: "high", label: "Alta" },
    { value: "critical", label: "Crítica" },
  ];

  return (
    <Card sx={{ mt: 2, mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Modelo de Negócio
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Configure o modelo de negócio e aspectos financeiros da campanha.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Modelo de Negócio</InputLabel>
              <Select
                value={formData.model}
                label="Modelo de Negócio"
                onChange={(e) => handleChange("model", e.target.value)}
              >
                {businessModels.map((model) => (
                  <MenuItem key={model.value} value={model.value}>
                    {model.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Prioridade</InputLabel>
              <Select
                value={formData.priority}
                label="Prioridade"
                onChange={(e) => handleChange("priority", e.target.value)}
              >
                {priorities.map((priority) => (
                  <MenuItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Orçamento"
              type="number"
              value={formData.budget}
              onChange={(e) => handleChange("budget", Number(e.target.value))}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>,
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Moeda</InputLabel>
              <Select
                value={formData.currency}
                label="Moeda"
                onChange={(e) => handleChange("currency", e.target.value)}
              >
                <MenuItem value="BRL">BRL</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.autoRenewal}
                  onChange={(e) => handleChange("autoRenewal", e.target.checked)}
                />
              }
              label="Renovação Automática"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {formData.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => {
                    const newTags = formData.tags.filter((_, i) => i !== index);
                    handleChange("tags", newTags);
                  }}
                />
              ))}
            </Box>
            <TextField
              fullWidth
              label="Adicionar Tag"
              size="small"
              sx={{ mt: 1 }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  const target = e.target as HTMLInputElement;
                  const newTag = target.value.trim();
                  if (newTag && !formData.tags.includes(newTag)) {
                    handleChange("tags", [...formData.tags, newTag]);
                    target.value = "";
                  }
                }
              }}
              placeholder="Digite uma tag e pressione Enter"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};