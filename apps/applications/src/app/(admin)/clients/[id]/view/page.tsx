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
  Stack,
  Container,
} from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";
import { Header } from "@/components/header";
import { useClientById } from "@/hooks/use-client";
import { useMounted } from "@/hooks/use-mounted";
import { Phone, Address } from "@/types/client";

interface ClientViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

const TAXPAYER_LABELS = {
  MEI: "MEI",
  SIMPLES_NACIONAL: "Simples Nacional",
  LUCRO_PRESUMIDO: "Lucro Presumido",
  LUCRO_REAL: "Lucro Real",
  INSENTO: "Insento",
} as const;

const PHONE_LABELS = {
  MOBILE: "Celular",
  LANDLINE: "Fixo",
  WHATSAPP: "WhatsApp",
} as const;

const getTaxpayerLabel = (type: string) =>
  TAXPAYER_LABELS[type as keyof typeof TAXPAYER_LABELS] || type || "-";
const getPhoneLabel = (type: string) =>
  PHONE_LABELS[type as keyof typeof PHONE_LABELS] || type || "Não informado";

const ClientViewPage = ({ params }: ClientViewPageProps) => {
  const router = useRouter();
  const mounted = useMounted();
  const { id } = use(params);

  const { data, isLoading, error } = useClientById(id);

  const handleEdit = () => {
    router.push(`/clients/${id}`);
  };

  const handleBack = () => {
    router.push("/clients");
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <Box>
        <Header
          title="Visualizar Cliente"
          description="Detalhes do cliente selecionado."
        />
        <Container>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="400px"
          >
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }

  // Early return patterns to avoid hydration mismatch
  if (isLoading) {
    return (
      <Box>
        <Header
          title="Visualizar Cliente"
          description="Detalhes do cliente selecionado."
        />
        <Container>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="400px"
          >
            <CircularProgress size={40} />
          </Box>
        </Container>
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
        <Container>
          <Alert severity="error">{error || "Erro ao carregar cliente"}</Alert>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleBack}
          >
            Voltar para Lista
          </Button>
        </Container>
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
        <Box>
          <Alert severity="warning">Cliente não encontrado</Alert>
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
          <Stack direction="row" spacing={2}>
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
          </Stack>
        }
      />
      <Paper
        elevation={1}
        sx={{ p: 3, mb: 3, width: "100%", display: "block" }}
      >
        <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Box>
            <Typography variant="body1" gutterBottom>
              CNPJ:
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.cnpj}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" gutterBottom>
              Nome da empresa:
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.companyName}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" gutterBottom>
              Nome fanasia:
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.fantasyName}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" gutterBottom>
              Tipo de contribuinte:
            </Typography>
            <Typography variant="h6" gutterBottom>
              {getTaxpayerLabel(data.taxpayerType)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" gutterBottom>
              Inscrição estadual:
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.stateRegistration || "-"}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" gutterBottom>
              Tipo de relação:
            </Typography>
            <Typography variant="h6" gutterBottom>
              {data.typeRelationship || "-"}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper
        elevation={1}
        sx={{ p: 3, mb: 3, width: "100%", display: "block" }}
      >
        {data.addresses.map((address: Address) => (
          <Box
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            key={address.id}
          >
            <Box>
              <Typography variant="body1" gutterBottom>
                Endereço:
              </Typography>
              <Typography variant="h6" gutterBottom>
                {address.street || "-"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" gutterBottom>
                Cep:
              </Typography>
              <Typography variant="h6" gutterBottom>
                {address.zipcode || "-"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" gutterBottom>
                Número:
              </Typography>
              <Typography variant="h6" gutterBottom>
                {address.number || "-"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" gutterBottom>
                Complemento:
              </Typography>
              <Typography variant="h6" gutterBottom>
                {address.complement || "-"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" gutterBottom>
                Bairro:
              </Typography>
              <Typography variant="h6" gutterBottom>
                {address.district || "-"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" gutterBottom>
                Cidade:
              </Typography>
              <Typography variant="h6" gutterBottom>
                {address.city || "-"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" gutterBottom>
                Estado:
              </Typography>
              <Typography variant="h6" gutterBottom>
                {address.state || "-"}
              </Typography>
            </Box>
          </Box>
        ))}
      </Paper>

      <Paper
        elevation={1}
        sx={{ p: 3, mb: 3, width: "100%", display: "block" }}
      >
        {data.phones.map((phone: Phone) => (
          <Box
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            key={phone.id}
          >
            <Box>
              <Typography variant="body1" gutterBottom>
                Telefone:
              </Typography>
              <Typography variant="h6" gutterBottom>
                {getPhoneLabel(phone.type)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" gutterBottom>
                Número
              </Typography>
              <Typography variant="h6" gutterBottom>
                {phone.number || "-"}
              </Typography>
            </Box>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default ClientViewPage;
