"use client";

import { useMemo } from "react";
import {
  Autocomplete,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useClient } from "@/features/clients/hooks/use-client";
import { useMounted } from "@/hooks/use-mounted";

export interface ClientSelectionStepProps {
  onClientSelect?: (clientId: string | null) => void;
  selectedClientId?: string | null;
}

interface ClientOption {
  value: string;
  label: string;
}

export const ClientSelectionStep = ({
  onClientSelect,
  selectedClientId,
}: ClientSelectionStepProps) => {
  const mounted = useMounted();

  // Buscar todos os clientes da API
  const { clients, isLoadingClients, error } = useClient({ limit: 100 }); // Carrega mais clientes

  // Converter clientes da API para formato do autocomplete
  const clientOptions: ClientOption[] = useMemo(() => {
    return clients.map((client) => ({
      value: client.id,
      label: `${client.companyName} - CNPJ: ${client.cnpj}`,
    }));
  }, [clients]);

  const selectedClient =
    clientOptions.find((client) => client.value === selectedClientId) || null;

  const handleClientChange = (
    _: React.SyntheticEvent,
    value: ClientOption | null
  ) => {
    if (onClientSelect) {
      onClientSelect(value?.value || null);
    }
  };

  return (
    <Card sx={{ mt: 2, mb: 2 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Identifique o Cliente
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Selecione o cliente para quem esta campanha será criada.
        </Typography>

        <Autocomplete
          fullWidth
          disablePortal
          options={clientOptions}
          value={selectedClient}
          onChange={handleClientChange}
          loading={mounted && isLoadingClients}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Buscar por razão social ou CNPJ"
              required
              slotProps={{
                input: {
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {mounted && isLoadingClients ? (
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
              {option.label}
            </li>
          )}
          noOptionsText={
            mounted && isLoadingClients
              ? "Carregando clientes..."
              : error
                ? "Erro ao carregar clientes"
                : "Nenhum cliente encontrado"
          }
        />

        {error && (
          <Typography variant="body2" color="error.main" sx={{ mt: 2 }}>
            ⚠️ Erro ao carregar clientes: {error}
          </Typography>
        )}

        {selectedClientId && (
          <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
            ✓ Cliente selecionado: {selectedClient?.label}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
