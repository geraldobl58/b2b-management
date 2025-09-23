"use client";

import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import {
  ClientSelectionStep,
  ContractSelectionStep,
  BasicDataStep,
  AdvancedSettingsStep,
  BusinessModelStep,
} from "./steps";
import { useCampaign } from "@/features/campaigns/hooks/use-campaign";
import {
  Card,
  CardContent,
  Alert,
  AlertTitle,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { useCampaignForm } from "@/features/campaigns/contexts";

const steps = [
  "Identifique o Cliente",
  "Selecione os Contratos",
  "Dados Básicos",
  "Modelo de Negócio",
  "Configurações Avançadas",
  "Finalizar e Revisar",
];

export const StepperContainer = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{
    [k: number]: boolean;
  }>({});

  // Estados para feedback do usuário
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);

  // Hook para criar campanha
  const { createCampaign, isCreating, createCampaignError } = useCampaign();

  // Hook do contexto da campanha
  const {
    campaignData,
    updateClientId,
    updateContractIds,
    updateBasicData,
    updateBusinessModel,
    updateAdvancedSettings,
    isStepValid,
    resetForm,
    toCampaignPayload,
  } = useCampaignForm();

  // Efeito para monitorar o estado da criação da campanha
  useEffect(() => {
    if (createCampaignError) {
      setShowErrorSnackbar(true);
      setShowSuccessSnackbar(false);
    } else if (!isCreating && showSuccessSnackbar === false) {
      // Se não está criando e não tem erro, pode ter sido um sucesso
      // Mas só mostra se teve uma tentativa anterior de criação
      const wasCreating = localStorage.getItem('campaign-creating');
      if (wasCreating === 'true') {
        setShowSuccessSnackbar(true);
        setShowErrorSnackbar(false);
        localStorage.removeItem('campaign-creating');

        // Resetar form após sucesso (opcional)
        setTimeout(() => {
          resetForm();
          setActiveStep(0);
          setCompleted({});
        }, 2000);
      }
    }

    // Marcar que está criando para rastrear mudanças de estado
    if (isCreating) {
      localStorage.setItem('campaign-creating', 'true');
    }
  }, [isCreating, createCampaignError, resetForm, showSuccessSnackbar]);

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
          steps.findIndex((_, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
    resetForm();
  };

  // Função para finalizar e criar a campanha
  const handleFinalizeCampaign = () => {
    try {
      const campaignPayload = toCampaignPayload();
      console.log("Criando campanha com dados:", campaignPayload);
      createCampaign(campaignPayload);
    } catch (error) {
      console.error("Erro ao criar campanha:", error);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <ClientSelectionStep
            selectedClientId={campaignData.clientId}
            onClientSelect={updateClientId}
          />
        );
      case 1:
        return (
          <ContractSelectionStep
            clientId={campaignData.clientId}
            selectedContractIds={campaignData.contractIds}
            onContractSelect={updateContractIds}
          />
        );
      case 2:
        return (
          <BasicDataStep
            data={campaignData.basicData}
            clientId={campaignData.clientId || undefined}
            onChange={updateBasicData}
          />
        );
      case 3:
        return (
          <BusinessModelStep
            data={campaignData.businessModel}
            onChange={updateBusinessModel}
          />
        );
      case 4:
        return (
          <AdvancedSettingsStep
            data={campaignData.advancedSettings}
            onChange={updateAdvancedSettings}
          />
        );
      case 5:
        return (
          <Card sx={{ mt: 2, mb: 2 }}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Finalizar e Revisar Campanha
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Revise todos os dados e finalize a criação da campanha.
              </Typography>

              {createCampaignError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  <AlertTitle>Erro ao criar campanha</AlertTitle>
                  {createCampaignError}
                </Alert>
              )}

              <Typography variant="h6" gutterBottom>
                Resumo dos Dados:
              </Typography>

              <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>Cliente ID:</strong> {campaignData.clientId}
                </Typography>
                <Typography variant="body2">
                  <strong>Contratos:</strong> {campaignData.contractIds.length}{" "}
                  selecionado(s)
                </Typography>
                <Typography variant="body2">
                  <strong>Nome:</strong>{" "}
                  {campaignData.basicData?.name || "Não informado"}
                </Typography>
                <Typography variant="body2">
                  <strong>Tipo:</strong>{" "}
                  {campaignData.basicData?.type || "Não informado"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleFinalizeCampaign}
                  disabled={isCreating || !campaignData.clientId}
                  startIcon={isCreating ? <CircularProgress size={20} /> : null}
                  sx={{ minWidth: 200 }}
                >
                  {isCreating ? "Criando..." : "Finalizar e Criar Campanha"}
                </Button>
              </Box>

            </CardContent>
          </Card>
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
                disabled={!isStepValid(activeStep)}
              >
                {activeStep === steps.length - 1 ? "Finalizar" : "Próximo"}
              </Button>
            </Box>
          </>
        )}
      </div>

      {/* Snackbars - Sempre visíveis independente do step */}
      {/* Snackbar de Sucesso */}
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowSuccessSnackbar(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Campanha criada com sucesso! Redirecionando...
        </Alert>
      </Snackbar>

      {/* Snackbar de Erro */}
      <Snackbar
        open={showErrorSnackbar}
        autoHideDuration={8000}
        onClose={() => setShowErrorSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowErrorSnackbar(false)}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Erro ao criar campanha: {createCampaignError || "Erro desconhecido"}
        </Alert>
      </Snackbar>

      {/* Snackbar de Loading */}
      <Snackbar
        open={isCreating}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="info"
          variant="filled"
          sx={{ width: "100%" }}
          icon={<CircularProgress size={20} color="inherit" />}
        >
          Criando campanha... Por favor, aguarde.
        </Alert>
      </Snackbar>
    </Box>
  );
};
