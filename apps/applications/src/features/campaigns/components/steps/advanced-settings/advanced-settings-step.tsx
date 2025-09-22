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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  Box
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

export interface AdvancedSettingsStepProps {
  data?: {
    automation?: {
      enabled?: boolean;
      triggers?: string[];
      conditions?: string[];
    };
    performance?: {
      maxConcurrentExecution?: number;
      timeout?: number;
      retryAttempts?: number;
    };
    notifications?: {
      emailAlerts?: boolean;
      smsAlerts?: boolean;
      webhookUrl?: string;
    };
    analytics?: {
      trackingEnabled?: boolean;
      customEvents?: boolean;
      dataRetention?: number;
    };
  };
  onChange?: (data: any) => void;
}

export const AdvancedSettingsStep = ({ data, onChange }: AdvancedSettingsStepProps) => {
  const [formData, setFormData] = useState({
    automation: {
      enabled: data?.automation?.enabled || false,
      triggers: data?.automation?.triggers || [],
      conditions: data?.automation?.conditions || [],
    },
    performance: {
      maxConcurrentExecution: data?.performance?.maxConcurrentExecution || 10,
      timeout: data?.performance?.timeout || 30,
      retryAttempts: data?.performance?.retryAttempts || 3,
    },
    notifications: {
      emailAlerts: data?.notifications?.emailAlerts || true,
      smsAlerts: data?.notifications?.smsAlerts || false,
      webhookUrl: data?.notifications?.webhookUrl || "",
    },
    analytics: {
      trackingEnabled: data?.analytics?.trackingEnabled || true,
      customEvents: data?.analytics?.customEvents || false,
      dataRetention: data?.analytics?.dataRetention || 90,
    },
  });

  const handleChange = (section: string, field: string, value: any) => {
    const newData = {
      ...formData,
      [section]: {
        ...formData[section as keyof typeof formData],
        [field]: value,
      },
    };
    setFormData(newData);
    onChange?.(newData);
  };

  return (
    <Card sx={{ mt: 2, mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Configurações Avançadas
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Configure aspectos avançados de automação, performance e monitoramento.
        </Typography>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">Automação</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.automation.enabled}
                      onChange={(e) =>
                        handleChange("automation", "enabled", e.target.checked)
                      }
                    />
                  }
                  label="Habilitar Automação"
                />
              </Grid>
              {formData.automation.enabled && (
                <>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Gatilhos</InputLabel>
                      <Select
                        multiple
                        value={formData.automation.triggers}
                        label="Gatilhos"
                        onChange={(e) =>
                          handleChange("automation", "triggers", e.target.value)
                        }
                      >
                        <MenuItem value="time">Baseado em Tempo</MenuItem>
                        <MenuItem value="event">Baseado em Evento</MenuItem>
                        <MenuItem value="condition">Baseado em Condição</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Condições</InputLabel>
                      <Select
                        multiple
                        value={formData.automation.conditions}
                        label="Condições"
                        onChange={(e) =>
                          handleChange("automation", "conditions", e.target.value)
                        }
                      >
                        <MenuItem value="user_action">Ação do Usuário</MenuItem>
                        <MenuItem value="data_threshold">Limite de Dados</MenuItem>
                        <MenuItem value="time_window">Janela de Tempo</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">Performance</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography gutterBottom>
                  Execuções Concorrentes: {formData.performance.maxConcurrentExecution}
                </Typography>
                <Slider
                  value={formData.performance.maxConcurrentExecution}
                  onChange={(_, value) =>
                    handleChange("performance", "maxConcurrentExecution", value)
                  }
                  min={1}
                  max={50}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Timeout (segundos)"
                  type="number"
                  value={formData.performance.timeout}
                  onChange={(e) =>
                    handleChange("performance", "timeout", Number(e.target.value))
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tentativas de Retry"
                  type="number"
                  value={formData.performance.retryAttempts}
                  onChange={(e) =>
                    handleChange("performance", "retryAttempts", Number(e.target.value))
                  }
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">Notificações</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.notifications.emailAlerts}
                      onChange={(e) =>
                        handleChange("notifications", "emailAlerts", e.target.checked)
                      }
                    />
                  }
                  label="Alertas por Email"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.notifications.smsAlerts}
                      onChange={(e) =>
                        handleChange("notifications", "smsAlerts", e.target.checked)
                      }
                    />
                  }
                  label="Alertas por SMS"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Webhook URL"
                  value={formData.notifications.webhookUrl}
                  onChange={(e) =>
                    handleChange("notifications", "webhookUrl", e.target.value)
                  }
                  placeholder="https://api.exemplo.com/webhook"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">Analytics</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.analytics.trackingEnabled}
                      onChange={(e) =>
                        handleChange("analytics", "trackingEnabled", e.target.checked)
                      }
                    />
                  }
                  label="Habilitar Tracking"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.analytics.customEvents}
                      onChange={(e) =>
                        handleChange("analytics", "customEvents", e.target.checked)
                      }
                    />
                  }
                  label="Eventos Customizados"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>
                  Retenção de Dados: {formData.analytics.dataRetention} dias
                </Typography>
                <Slider
                  value={formData.analytics.dataRetention}
                  onChange={(_, value) =>
                    handleChange("analytics", "dataRetention", value)
                  }
                  min={30}
                  max={365}
                  marks={[
                    { value: 30, label: "30d" },
                    { value: 90, label: "90d" },
                    { value: 180, label: "180d" },
                    { value: 365, label: "1 ano" },
                  ]}
                  valueLabelDisplay="auto"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};