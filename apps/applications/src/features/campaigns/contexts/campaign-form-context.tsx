"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CreateCampaignValues } from "@/features/campaigns/schemas/campaign";

// Enums para compatibilidade com os componentes
export enum PaymentMethod {
  CREDIT_CARD = "Cartão de Crédito",
  DEBIT_CARD = "Cartão de Débito",
  BANK_SLIP = "Boleto Bancário",
  PIX = "PIX",
  CASH = "Dinheiro",
}

export enum DeliveryType {
  DIGITAL = "DIGITAL",
  PHYSICAL = "PHYSICAL",
}

// Interfaces para os dados do formulário em cada step
export interface BasicDataForm {
  name?: string;
  startDate?: string;
  endDate?: string;
  type?: "MKT" | "SALES" | "RETENTION" | "UPSELL";
  branchType?: "MATRIZ" | "FILIAL";
  observations?: string;
}

export interface BusinessModelForm {
  paymentMethod?: PaymentMethod;
  upfront?: boolean;
  daysToInvoice?: number;
  notes?: string;
  billingModel?: string;
  estimateMonthly?: number;
  estimateAnnual?: number;
  autoInvoicing?: boolean;
  priceCycle?: "MONTHLY" | "QUARTERLY" | "YEARLY";
  deliveryType?: DeliveryType;
  additional?: boolean;
  daysToDeliver?: number;
  chargeFreight?: boolean;
  b2b?: boolean;
}

export interface AdvancedSettingsForm {
  contractPending?: boolean;
  orderConfirmationEnabled?: boolean;
  confirmationTimeMinutes?: number;
  differentialFlow?: boolean;
  blockOrdersDuringCampaign?: boolean;
  delinquencyPolicy?: string;
}

export interface FinishedRevisionForm {
  reviewedBy?: string;
}

export interface CampaignFormData {
  clientId: string | null;
  contractIds: string[];
  basicData: BasicDataForm;
  businessModel: BusinessModelForm;
  advancedSettings: AdvancedSettingsForm;
  finishedRevision: FinishedRevisionForm;
}

// Contexto do formulário
interface CampaignFormContextType {
  // Dados do formulário
  campaignData: CampaignFormData;

  // Métodos para atualizar os dados
  updateClientId: (clientId: string | null) => void;
  updateContractIds: (contractIds: string[]) => void;
  updateBasicData: (data: Record<string, unknown>) => void;
  updateBusinessModel: (data: Record<string, unknown>) => void;
  updateAdvancedSettings: (data: Record<string, unknown>) => void;
  updateFinishedRevision: (data: Record<string, unknown>) => void;

  // Validação de steps
  isStepValid: (step: number) => boolean;

  // Reset do formulário
  resetForm: () => void;

  // Transformar para payload da API
  toCampaignPayload: () => CreateCampaignValues;
}

const CampaignFormContext = createContext<CampaignFormContextType | undefined>(
  undefined
);

// Dados iniciais do formulário
const initialCampaignData: CampaignFormData = {
  clientId: null,
  contractIds: [],
  basicData: {},
  businessModel: {},
  advancedSettings: {},
  finishedRevision: {},
};

// Provider do contexto
export const CampaignFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [campaignData, setCampaignData] =
    useState<CampaignFormData>(initialCampaignData);

  // Métodos para atualizar dados específicos
  const updateClientId = useCallback((clientId: string | null) => {
    setCampaignData((prev) => ({ ...prev, clientId }));
  }, []);

  const updateContractIds = useCallback((contractIds: string[]) => {
    setCampaignData((prev) => ({ ...prev, contractIds }));
  }, []);

  const updateBasicData = useCallback((data: Record<string, unknown>) => {
    setCampaignData((prev) => ({
      ...prev,
      basicData: { ...prev.basicData, ...data },
    }));
  }, []);

  const updateBusinessModel = useCallback((data: Record<string, unknown>) => {
    setCampaignData((prev) => ({
      ...prev,
      businessModel: { ...prev.businessModel, ...data },
    }));
  }, []);

  const updateAdvancedSettings = useCallback(
    (data: Record<string, unknown>) => {
      setCampaignData((prev) => ({
        ...prev,
        advancedSettings: { ...prev.advancedSettings, ...data },
      }));
    },
    []
  );

  const updateFinishedRevision = useCallback(
    (data: Record<string, unknown>) => {
      setCampaignData((prev) => ({
        ...prev,
        finishedRevision: { ...prev.finishedRevision, ...data },
      }));
    },
    []
  );

  // Validação de steps
  const isStepValid = useCallback(
    (step: number): boolean => {
      switch (step) {
        case 0:
          return !!campaignData.clientId;
        case 1:
          return campaignData.contractIds.length > 0;
        case 2: {
          const basicData = campaignData.basicData;
          return !!(
            basicData?.name?.trim() &&
            basicData?.startDate &&
            basicData?.endDate &&
            basicData?.type &&
            basicData?.branchType
          );
        }
        case 3: {
          const businessModel = campaignData.businessModel;
          return !!(
            businessModel?.paymentMethod && businessModel?.deliveryType
          );
        }
        case 4: {
          const advancedSettings = campaignData.advancedSettings;
          return (
            !advancedSettings ||
            !advancedSettings.confirmationTimeMinutes ||
            (advancedSettings.confirmationTimeMinutes >= 5 &&
              advancedSettings.confirmationTimeMinutes <= 60)
          );
        }
        case 5: {
          const finishedRevision = campaignData.finishedRevision;
          return !!finishedRevision?.reviewedBy?.trim();
        }
        default:
          return true;
      }
    },
    [campaignData]
  );

  // Reset do formulário
  const resetForm = useCallback(() => {
    setCampaignData(initialCampaignData);
  }, []);

  // Transformar para payload da API
  const toCampaignPayload = useCallback((): CreateCampaignValues => {
    return {
      name: campaignData.basicData.name || "",
      startDate: campaignData.basicData.startDate || "",
      endDate: campaignData.basicData.endDate || "",
      city: "São Paulo", // Valor padrão - poderia vir do cliente
      type: campaignData.basicData.type || "MKT",
      branchType: campaignData.basicData.branchType || "MATRIZ",
      observations: campaignData.basicData.observations || "",
      clientId: campaignData.clientId || "",
      contractId: campaignData.contractIds[0] || "", // Primeiro contrato selecionado
      contacts: [], // Por enquanto vazio, poderia ser implementado
      business: {
        paymentMethod:
          campaignData.businessModel.paymentMethod || PaymentMethod.PIX,
        upfront: campaignData.businessModel.upfront || false,
        daysToInvoice: campaignData.businessModel.daysToInvoice || 30,
        notes: campaignData.businessModel.notes || "",
        billingModel: campaignData.businessModel.billingModel || "MONTHLY",
        estimateMonthly: campaignData.businessModel.estimateMonthly || 0,
        estimateAnnual: campaignData.businessModel.estimateAnnual || 0,
        autoInvoicing: campaignData.businessModel.autoInvoicing || false,
        priceCycle: campaignData.businessModel.priceCycle || "MONTHLY",
        deliveryType:
          campaignData.businessModel.deliveryType || DeliveryType.DIGITAL,
        additional: campaignData.businessModel.additional || false,
        daysToDeliver: campaignData.businessModel.daysToDeliver || 0,
        chargeFreight: campaignData.businessModel.chargeFreight || false,
        b2b: campaignData.businessModel.b2b || true,
      },
      config: {
        contractPending: campaignData.advancedSettings.contractPending || false,
        orderConfirmationEnabled:
          campaignData.advancedSettings.orderConfirmationEnabled || true,
        confirmationTimeMinutes:
          campaignData.advancedSettings.confirmationTimeMinutes || 10,
        differentialFlow:
          campaignData.advancedSettings.differentialFlow || false,
        blockOrdersDuringCampaign:
          campaignData.advancedSettings.blockOrdersDuringCampaign || false,
        delinquencyPolicy:
          campaignData.advancedSettings.delinquencyPolicy || "Política padrão",
      },
    };
  }, [campaignData]);

  const value: CampaignFormContextType = {
    campaignData,
    updateClientId,
    updateContractIds,
    updateBasicData,
    updateBusinessModel,
    updateAdvancedSettings,
    updateFinishedRevision,
    isStepValid,
    resetForm,
    toCampaignPayload,
  };

  return (
    <CampaignFormContext.Provider value={value}>
      {children}
    </CampaignFormContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useCampaignForm = (): CampaignFormContextType => {
  const context = useContext(CampaignFormContext);
  if (context === undefined) {
    throw new Error(
      "useCampaignForm must be used within a CampaignFormProvider"
    );
  }
  return context;
};
