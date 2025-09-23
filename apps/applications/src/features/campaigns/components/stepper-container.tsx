"use client";

import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import {
  ClientSelectionStep,
  ContractSelectionStep,
  BasicDataStep,
  AdvancedSettingsStep,
  BusinessModelStep,
} from "./steps";

const steps = [
  "Identifique o Cliente",
  "Selecione os Contratos",
  "Dados Básicos",
  "Modelo de Negócio",
  "Configurações Avançadas",
];

export const StepperContainer = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{
    [k: number]: boolean;
  }>({});

  // Form data state
  const [campaignData, setCampaignData] = useState({
    clientId: null as string | null,
    contractIds: [] as string[],
    basicData: {},
    businessModel: {},
    advancedSettings: {},
  });

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
    setCampaignData({
      clientId: null,
      contractIds: [],
      basicData: {},
      businessModel: {},
      advancedSettings: {},
    });
  };

  const updateCampaignData = (section: string, data: unknown) => {
    setCampaignData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return !!campaignData.clientId;
      case 1:
        return campaignData.contractIds.length > 0;
      case 2: {
        const basicData = campaignData.basicData as {
          name?: string;
          startDate?: string;
          endDate?: string;
          city?: string;
          type?: string;
          branchType?: string;
        };
        return !!(
          basicData?.name?.trim() &&
          basicData?.startDate &&
          basicData?.endDate &&
          basicData?.city?.trim() &&
          basicData?.type &&
          basicData?.branchType
        );
      }
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <ClientSelectionStep
            selectedClientId={campaignData.clientId}
            onClientSelect={(clientId) =>
              updateCampaignData("clientId", clientId)
            }
          />
        );
      case 1:
        return (
          <ContractSelectionStep
            clientId={campaignData.clientId}
            selectedContractIds={campaignData.contractIds}
            onContractSelect={(contractIds) =>
              updateCampaignData("contractIds", contractIds)
            }
          />
        );
      case 2:
        return (
          <BasicDataStep
            data={campaignData.basicData}
            onChange={(data) => updateCampaignData("basicData", data)}
          />
        );
      case 3:
        return (
          <BusinessModelStep
            data={campaignData.businessModel}
            onChange={(data) => updateCampaignData("businessModel", data)}
          />
        );
      case 4:
        return (
          <AdvancedSettingsStep
            data={campaignData.advancedSettings}
            onChange={(data) => updateCampaignData("advancedSettings", data)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper nonLinear activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit">{label}</StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        {allStepsCompleted() ? (
          <>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </>
        ) : (
          <>
            {renderStepContent()}
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2, pl: 2 }}>
              <Button
                color="error"
                variant="outlined"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                {activeStep === 0 ? "Cancelar" : "Voltar"}
              </Button>
              <Button
                onClick={handleNext}
                sx={{ mr: 1 }}
                disabled={!isStepValid()}
              >
                {activeStep === steps.length - 1 ? "Finalizar" : "Próximo"}
              </Button>
            </Box>
          </>
        )}
      </div>
    </Box>
  );
};
