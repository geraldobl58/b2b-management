"use client";

import {
  Autocomplete,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useContract } from "@/features/contracts/hooks/use-contract";
import { useMounted } from "@/hooks/use-mounted";
import { useMemo } from "react";

export interface ContractSelectionStepProps {
  onContractSelect?: (contractIds: string[]) => void;
  selectedContractIds?: string[];
  clientId?: string | null;
}

interface ContractOption {
  value: string;
  label: string;
  partner: string;
  startDate: string;
  endDate: string;
}

export const ContractSelectionStep = ({
  onContractSelect,
  selectedContractIds = [],
  clientId,
}: ContractSelectionStepProps) => {
  const mounted = useMounted();

  // Buscar contratos da API
  const { contracts, isLoadingContracts, error } = useContract({
    limit: 100,
    clientName: clientId ? undefined : "", // Se não tem clientId, não busca nada ainda
  });

  // Filtrar contratos por clientId e converter para formato do autocomplete
  const contractOptions: ContractOption[] = useMemo(() => {
    if (!clientId) return [];

    return contracts
      .filter((contract) => contract.clientId === clientId)
      .map((contract) => ({
        value: contract.id,
        label: contract.name,
        partner: contract.partner,
        startDate: contract.startDate,
        endDate: contract.endDate,
      }));
  }, [contracts, clientId]);

  const selectedContracts = contractOptions.filter((contract) =>
    selectedContractIds.includes(contract.value)
  );

  const handleContractChange = (
    _: React.SyntheticEvent,
    values: ContractOption[]
  ) => {
    if (onContractSelect) {
      onContractSelect(values.map((v) => v.value));
    }
  };

  return (
    <Card sx={{ mt: 2, mb: 2 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Selecione os Contratos
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Escolha os contratos que serão usados como base para esta campanha.
        </Typography>

        {clientId ? (
          <>
            <Autocomplete
              fullWidth
              multiple
              disablePortal
              options={contractOptions}
              value={selectedContracts}
              onChange={handleContractChange}
              loading={mounted && isLoadingContracts}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Selecione os contratos"
                  required
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {mounted && isLoadingContracts ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    },
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.value}>
                  <div>
                    <div>{option.label}</div>
                    <Typography variant="caption" color="text.secondary">
                      Parceiro: {option.partner} • Período:{" "}
                      {new Date(option.startDate).toLocaleDateString("pt-BR")} -{" "}
                      {new Date(option.endDate).toLocaleDateString("pt-BR")}
                    </Typography>
                  </div>
                </li>
              )}
              noOptionsText={
                mounted && isLoadingContracts
                  ? "Carregando contratos..."
                  : error
                    ? "Erro ao carregar contratos"
                    : "Nenhum contrato encontrado para este cliente"
              }
            />

            {error && (
              <Typography variant="body2" color="error.main" sx={{ mt: 2 }}>
                ⚠️ Erro ao carregar contratos: {error}
              </Typography>
            )}

            {selectedContractIds.length > 0 && (
              <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
                ✓ {selectedContractIds.length} contrato(s) selecionado(s):{" "}
                {selectedContracts.map((c) => c.label).join(", ")}
              </Typography>
            )}

            {mounted &&
              !isLoadingContracts &&
              !error &&
              contractOptions.length === 0 &&
              clientId && (
                <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>
                  Nenhum contrato encontrado para este cliente.
                </Typography>
              )}
          </>
        ) : (
          <Typography variant="body2" color="warning.main">
            Primeiro selecione um cliente para ver os contratos disponíveis.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
