"use client";

import { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Divider,
  Slider,
  Alert,
  AlertTitle,
} from "@mui/material";

export interface AdvancedSettingsStepProps {
  data?: {
    contractPending?: boolean;
    orderConfirmationEnabled?: boolean;
    confirmationTimeMinutes?: number;
    differentialFlow?: boolean;
    blockOrdersDuringCampaign?: boolean;
    delinquencyPolicy?: string;
  };
  onChange?: (data: {
    contractPending: boolean;
    orderConfirmationEnabled: boolean;
    confirmationTimeMinutes: number;
    differentialFlow: boolean;
    blockOrdersDuringCampaign: boolean;
    delinquencyPolicy: string;
  }) => void;
}

const initialFormData = {
  contractPending: false,
  orderConfirmationEnabled: true,
  confirmationTimeMinutes: 10,
  differentialFlow: false,
  blockOrdersDuringCampaign: false,
  delinquencyPolicy: "",
};

export const AdvancedSettingsStep = ({
  data,
  onChange,
}: AdvancedSettingsStepProps) => {
  const [formData, setFormData] = useState({
    ...initialFormData,
    ...data,
  });

  const handleChange = (field: string, value: string | number | boolean) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange?.(newData);
  };

  // Atualizar form data quando props mudam
  useEffect(() => {
    if (data) {
      setFormData({
        ...initialFormData,
        ...data,
      });
    }
  }, [data]);

  // Marcadores para o tempo de confirmação em minutos
  const timeMarks = [
    { value: 5, label: "5min" },
    { value: 10, label: "10min" },
    { value: 15, label: "15min" },
    { value: 30, label: "30min" },
    { value: 60, label: "1h" },
  ];

  return (
    <Card sx={{ mt: 2, mb: 2 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Configurações Avançadas
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Configure opções avançadas para otimizar o comportamento da campanha.
        </Typography>

        <div className="space-y-6">
          {/* Seção de Contratos */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Gestão de Contratos
            </Typography>
            <div className="mt-3">
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.contractPending}
                    onChange={(e) =>
                      handleChange("contractPending", e.target.checked)
                    }
                  />
                }
                label="Contrato pendente"
              />
              <Typography variant="body2" sx={{ ml: 4, mt: 1 }}>
                Indica se há pendências contratuais que precisam ser resolvidas
                antes do início da campanha
              </Typography>
            </div>
          </Box>

          <Divider />

          {/* Seção de Confirmação de Pedidos */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirmação de Pedidos
            </Typography>

            <div className="mt-3">
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.orderConfirmationEnabled}
                    onChange={(e) =>
                      handleChange("orderConfirmationEnabled", e.target.checked)
                    }
                  />
                }
                label="Habilitar confirmação de pedidos"
              />
              <Typography variant="body2" sx={{ ml: 4, mt: 1 }}>
                Quando ativado, os pedidos precisarão ser confirmados dentro do
                tempo limite
              </Typography>
            </div>

            {formData.orderConfirmationEnabled && (
              <Box sx={{ mt: 4, px: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Tempo limite para confirmação:{" "}
                  {formData.confirmationTimeMinutes} minutos
                </Typography>
                <Slider
                  value={formData.confirmationTimeMinutes}
                  onChange={(_, newValue) =>
                    handleChange("confirmationTimeMinutes", newValue as number)
                  }
                  min={5}
                  max={60}
                  step={5}
                  marks={timeMarks}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}min`}
                  sx={{ mt: 2 }}
                />
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Define quanto tempo o cliente tem para confirmar um pedido
                  após a criação
                </Typography>
              </Box>
            )}
          </Box>

          <Divider />

          {/* Seção de Fluxo de Trabalho */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Fluxo de Trabalho
            </Typography>

            <div className="space-y-4 mt-3">
              <div>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.differentialFlow}
                      onChange={(e) =>
                        handleChange("differentialFlow", e.target.checked)
                      }
                    />
                  }
                  label="Fluxo diferenciado"
                />
                <Typography variant="body2" sx={{ ml: 4, mt: 1 }}>
                  Ativa um fluxo de trabalho especial com regras customizadas
                  para esta campanha
                </Typography>
              </div>

              <div>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.blockOrdersDuringCampaign}
                      onChange={(e) =>
                        handleChange(
                          "blockOrdersDuringCampaign",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Bloquear pedidos durante a campanha"
                />
                <Typography variant="body2" sx={{ ml: 4, mt: 1 }}>
                  Impede a criação de novos pedidos enquanto a campanha estiver
                  ativa
                </Typography>
              </div>
            </div>

            {formData.blockOrdersDuringCampaign && (
              <Alert severity="warning" sx={{ mt: 3 }}>
                <AlertTitle>Atenção</AlertTitle>
                Com esta opção ativada, nenhum pedido poderá ser criado durante
                o período da campanha. Certifique-se de que isso está alinhado
                com os objetivos da campanha.
              </Alert>
            )}
          </Box>

          <Divider />

          {/* Seção de Políticas */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Políticas e Regras
            </Typography>

            <TextField
              fullWidth
              label="Política de Inadimplência"
              multiline
              rows={4}
              value={formData.delinquencyPolicy}
              onChange={(e) =>
                handleChange("delinquencyPolicy", e.target.value)
              }
              placeholder="Defina as regras e procedimentos para casos de inadimplência (opcional)"
              slotProps={{
                htmlInput: {
                  maxLength: 1000,
                },
              }}
              helperText={`${formData.delinquencyPolicy.length}/1000 caracteres`}
              sx={{ mt: 2 }}
            />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Especifique como serão tratados os casos de inadimplência,
              incluindo prazos, penalidades e procedimentos de cobrança
            </Typography>
          </Box>

          {/* Resumo das Configurações */}
          <Box sx={{ mt: 4, p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Resumo das Configurações
            </Typography>
            <div className="space-y-2">
              <Typography variant="body2">
                <strong>Contrato:</strong>{" "}
                {formData.contractPending ? "Pendente" : "Aprovado"}
              </Typography>
              <Typography variant="body2">
                <strong>Confirmação de Pedidos:</strong>{" "}
                {formData.orderConfirmationEnabled
                  ? "Habilitada"
                  : "Desabilitada"}
                {formData.orderConfirmationEnabled &&
                  ` (${formData.confirmationTimeMinutes} min)`}
              </Typography>
              <Typography variant="body2">
                <strong>Fluxo Diferenciado:</strong>{" "}
                {formData.differentialFlow ? "Ativado" : "Desativado"}
              </Typography>
              <Typography variant="body2">
                <strong>Bloqueio de Pedidos:</strong>{" "}
                {formData.blockOrdersDuringCampaign ? "Ativado" : "Desativado"}
              </Typography>
              <Typography variant="body2">
                <strong>Política de Inadimplência:</strong>{" "}
                {formData.delinquencyPolicy ? "Definida" : "Não definida"}
              </Typography>
            </div>
          </Box>
        </div>
      </CardContent>
    </Card>
  );
};
