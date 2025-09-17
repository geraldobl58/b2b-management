"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";
import { Header } from "@/components/header";
import { useClientById } from "@/hooks/use-client";
import { Phone, Address } from "@/types/client";

interface ClientViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ClientViewPage = ({ params }: ClientViewPageProps) => {
  const router = useRouter();
  const { id } = use(params);

  const { data, isLoading, error } = useClientById(id);

  const handleEdit = () => {
    router.push(`/clients/${id}`);
  };

  const handleBack = () => {
    router.push("/clients");
  };

  // Early return patterns to avoid hydration mismatch
  if (isLoading) {
    return (
      <Box>
        <Header
          title="Visualizar Cliente"
          description="Detalhes do cliente selecionado."
        />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Header
          title="Visualizar Cliente"
          description="Detalhes do cliente selecionado."
        />
        <Alert severity="error" sx={{ mt: 2 }}>
          {error || "Erro ao carregar cliente"}
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleBack}
          >
            Voltar para Lista
          </Button>
        </Box>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box>
        <Header
          title="Visualizar Cliente"
          description="Detalhes do cliente selecionado."
        />
        <Alert severity="warning" sx={{ mt: 2 }}>
          Cliente não encontrado
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleBack}
          >
            Voltar para Lista
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Header
        title="Visualizar Cliente"
        description="Detalhes do cliente selecionado."
        content={
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBack}
            >
              Voltar
            </Button>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleEdit}
            >
              Editar
            </Button>
          </Box>
        }
      />

      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        {/* Informações Básicas */}
        <Typography variant="h6" gutterBottom>
          Informações Básicas
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              CNPJ
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {data.cnpj || "-"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Razão Social
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {data.companyName || "-"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Nome Fantasia
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {data.fantasyName || "-"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Tipo de Contribuinte
            </Typography>
            <Chip
              label={data.taxpayerType || "Não informado"}
              size="small"
              variant="outlined"
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Inscrição Estadual
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {data.stateRegistration || "-"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Tipo de Relacionamento
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {data.typeRelationship || "-"}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Telefones */}
        <Typography variant="h6" gutterBottom>
          Telefones
        </Typography>

        {data.phones && data.phones.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              mb: 4,
            }}
          >
            {data.phones.map((phone: Phone, index: number) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: "grey.300",
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  {phone.type === "LANDLINE"
                    ? "Fixo"
                    : phone.type === "MOBILE"
                      ? "Celular"
                      : phone.type === "WHATSAPP"
                        ? "WhatsApp"
                        : phone.type}
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {phone.number || "-"}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Nenhum telefone cadastrado
          </Typography>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Endereços */}
        <Typography variant="h6" gutterBottom>
          Endereços
        </Typography>

        {data.addresses && data.addresses.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {data.addresses.map((address: Address, index: number) => (
              <Box
                key={index}
                sx={{
                  p: 3,
                  border: 1,
                  borderColor: "grey.300",
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      CEP
                    </Typography>
                    <Typography variant="body1">
                      {address.zipcode || "-"}
                    </Typography>
                  </Box>

                  <Box sx={{ gridColumn: { xs: "1", md: "span 2" } }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Logradouro
                    </Typography>
                    <Typography variant="body1">
                      {address.street || "-"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Número
                    </Typography>
                    <Typography variant="body1">
                      {address.number || "-"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Complemento
                    </Typography>
                    <Typography variant="body1">
                      {address.complement || "-"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Bairro
                    </Typography>
                    <Typography variant="body1">
                      {address.district || "-"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Cidade
                    </Typography>
                    <Typography variant="body1">
                      {address.city || "-"}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Estado
                    </Typography>
                    <Typography variant="body1">
                      {address.state || "-"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Nenhum endereço cadastrado
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ClientViewPage;
