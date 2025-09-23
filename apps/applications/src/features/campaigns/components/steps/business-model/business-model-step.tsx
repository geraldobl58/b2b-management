"use client";

import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";

enum PaymentMethod {
  CREDIT_CARD = "Cartão de Credito",
  BANK_TRANSFER = "Tranferiencia",
  PIX = "PIX",
  BOLETO = "BOLETO",
}

enum DeliveryType {
  DIGITAL = "DIGITAL",
  PHYSICAL = "PHYSICAL",
  HYBRID = "HYBRID",
}

export interface BusinessModelStepProps {
  data?: {
    paymentMethod?: PaymentMethod;
    upfront?: boolean;
    daysToInvoice?: number;
    notes?: string | null;
    billingModel?: string;
    estimateMonthly?: number;
    estimateAnnual?: number;
    autoInvoicing?: boolean;
    priceCycle?: string;
    deliveryType?: DeliveryType;
    additional?: boolean;
    daysToDeliver?: number;
    chargeFreight?: boolean;
    b2b?: boolean;
  };
  onChange?: (data: {
    paymentMethod: PaymentMethod;
    upfront: boolean;
    daysToInvoice: number;
    notes: string;
    billingModel: string;
    estimateMonthly: number;
    estimateAnnual: number;
    autoInvoicing: boolean;
    priceCycle: string;
    deliveryType: DeliveryType;
    additional: boolean;
    daysToDeliver: number;
    chargeFreight: boolean;
    b2b: boolean;
  }) => void;
}

const initialFormData = {
  paymentMethod: PaymentMethod.PIX,
  upfront: false,
  daysToInvoice: 30,
  notes: "",
  billingModel: "",
  estimateMonthly: 0,
  estimateAnnual: 0,
  autoInvoicing: false,
  priceCycle: "MONTHLY",
  deliveryType: DeliveryType.DIGITAL,
  additional: false,
  daysToDeliver: 0,
  chargeFreight: false,
  b2b: true,
};

export const BusinessModelStep = ({
  data,
  onChange,
}: BusinessModelStepProps) => {
  const [formData, setFormData] = useState({
    ...initialFormData,
    ...data,
  });

  const handleChange = (field: string, value: string | number | boolean) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange?.({ ...newData, notes: newData.notes || "" });
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

  const paymentMethods = [
    { value: PaymentMethod.PIX, label: "PIX" },
    { value: PaymentMethod.CREDIT_CARD, label: "Cartão de Crédito" },
    { value: PaymentMethod.BANK_TRANSFER, label: "Transferência Bancária" },
    { value: PaymentMethod.BOLETO, label: "Boleto Bancário" },
  ];

  const billingModels = [
    { value: "MONTHLY", label: "Mensal" },
    { value: "QUARTERLY", label: "Trimestral" },
    { value: "SEMIANNUAL", label: "Semestral" },
    { value: "ANNUAL", label: "Anual" },
    { value: "PROJECT", label: "Por Projeto" },
    { value: "PERFORMANCE", label: "Por Performance" },
  ];

  const priceCycles = [
    { value: "MONTHLY", label: "Mensal" },
    { value: "QUARTERLY", label: "Trimestral" },
    { value: "ANNUAL", label: "Anual" },
  ];

  const deliveryTypes = [
    { value: DeliveryType.DIGITAL, label: "Digital" },
    { value: DeliveryType.PHYSICAL, label: "Físico" },
    { value: DeliveryType.HYBRID, label: "Híbrido (Digital + Físico)" },
  ];

  return (
    <Card sx={{ mt: 2, mb: 2 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Modelo de Negócio
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Defina o modelo de negócio e as preferências da campanha.
        </Typography>

        <div className="space-y-6">
          {/* Seção de Pagamento */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Configurações de Pagamento
            </Typography>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <FormControl fullWidth required>
                <InputLabel>Método de Pagamento</InputLabel>
                <Select
                  value={formData.paymentMethod}
                  label="Método de Pagamento"
                  onChange={(e) =>
                    handleChange("paymentMethod", e.target.value)
                  }
                >
                  {paymentMethods.map((method) => (
                    <MenuItem key={method.value} value={method.value}>
                      {method.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Dias para Faturamento"
                type="number"
                value={formData.daysToInvoice}
                onChange={(e) =>
                  handleChange("daysToInvoice", parseInt(e.target.value) || 0)
                }
                slotProps={{ htmlInput: { min: 0, max: 365 } }}
                helperText="Quantos dias para emitir a fatura"
              />
            </div>

            <div className="mt-4">
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.upfront}
                    onChange={(e) => handleChange("upfront", e.target.checked)}
                  />
                }
                label="Pagamento antecipado"
              />
            </div>
          </Box>

          <Divider />

          {/* Seção de Faturamento */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Faturamento e Estimativas
            </Typography>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <FormControl fullWidth>
                <InputLabel>Modelo de Faturamento</InputLabel>
                <Select
                  value={formData.billingModel}
                  label="Modelo de Faturamento"
                  onChange={(e) => handleChange("billingModel", e.target.value)}
                >
                  {billingModels.map((model) => (
                    <MenuItem key={model.value} value={model.value}>
                      {model.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Ciclo de Preços</InputLabel>
                <Select
                  value={formData.priceCycle}
                  label="Ciclo de Preços"
                  onChange={(e) => handleChange("priceCycle", e.target.value)}
                >
                  {priceCycles.map((cycle) => (
                    <MenuItem key={cycle.value} value={cycle.value}>
                      {cycle.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <TextField
                fullWidth
                label="Estimativa Mensal"
                type="number"
                value={formData.estimateMonthly}
                onChange={(e) =>
                  handleChange(
                    "estimateMonthly",
                    parseFloat(e.target.value) || 0
                  )
                }
                slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                helperText="Valor estimado mensal (R$)"
              />

              <TextField
                fullWidth
                label="Estimativa Anual"
                type="number"
                value={formData.estimateAnnual}
                onChange={(e) =>
                  handleChange(
                    "estimateAnnual",
                    parseFloat(e.target.value) || 0
                  )
                }
                slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                helperText="Valor estimado anual (R$)"
              />
            </div>

            <div className="mt-4">
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.autoInvoicing}
                    onChange={(e) =>
                      handleChange("autoInvoicing", e.target.checked)
                    }
                  />
                }
                label="Faturamento automático"
              />
            </div>
          </Box>

          <Divider />

          {/* Seção de Entrega */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Configurações de Entrega
            </Typography>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <FormControl fullWidth required>
                <InputLabel>Tipo de Entrega</InputLabel>
                <Select
                  value={formData.deliveryType}
                  label="Tipo de Entrega"
                  onChange={(e) => handleChange("deliveryType", e.target.value)}
                >
                  {deliveryTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {(formData.deliveryType === DeliveryType.PHYSICAL ||
                formData.deliveryType === DeliveryType.HYBRID) && (
                <TextField
                  fullWidth
                  label="Dias para Entrega"
                  type="number"
                  value={formData.daysToDeliver}
                  onChange={(e) =>
                    handleChange("daysToDeliver", parseInt(e.target.value) || 0)
                  }
                  slotProps={{ htmlInput: { min: 0, max: 365 } }}
                  helperText="Tempo de entrega em dias"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.additional}
                    onChange={(e) =>
                      handleChange("additional", e.target.checked)
                    }
                  />
                }
                label="Serviços adicionais"
              />

              {(formData.deliveryType === DeliveryType.PHYSICAL ||
                formData.deliveryType === DeliveryType.HYBRID) && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.chargeFreight}
                      onChange={(e) =>
                        handleChange("chargeFreight", e.target.checked)
                      }
                    />
                  }
                  label="Cobrar frete"
                />
              )}
            </div>
          </Box>

          <Divider />

          {/* Seção de Tipo de Negócio */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Tipo de Negócio
            </Typography>
            <div className="mt-3">
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.b2b}
                    onChange={(e) => handleChange("b2b", e.target.checked)}
                  />
                }
                label="Negócio B2B (Business to Business)"
              />
            </div>
          </Box>

          <Divider />

          {/* Seção de Observações */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Observações
            </Typography>
            <TextField
              fullWidth
              label="Notas Adicionais"
              multiline
              rows={4}
              value={formData.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Adicione observações sobre o modelo de negócio (opcional)"
              slotProps={{
                htmlInput: {
                  maxLength: 1000,
                },
              }}
              helperText={`${(formData.notes || "").length}/1000 caracteres`}
            />
          </Box>
        </div>
      </CardContent>
    </Card>
  );
};
