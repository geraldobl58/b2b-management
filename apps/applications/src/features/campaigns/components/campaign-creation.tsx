"use client";

import { CampaignFormProvider } from "@/features/campaigns/contexts";
import { StepperContainer } from "./stepper-container";

/**
 * Componente principal para criação de campanhas
 * Fornece o contexto necessário para o fluxo de criação
 */
export const CampaignCreation = () => {
  return (
    <CampaignFormProvider>
      <StepperContainer />
    </CampaignFormProvider>
  );
};