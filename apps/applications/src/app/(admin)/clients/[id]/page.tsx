"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { Header } from "@/components/header";
import { ClientForm } from "../_components/client-form";
import { useClientById } from "@/features/clients/hooks/use-client";

interface ClientIdPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ClientIdPage = ({ params }: ClientIdPageProps) => {
  const router = useRouter();
  const { id } = use(params);

  // Fetch client data to check if it exists and show loading state
  const { isLoading } = useClientById(id);

  const handleSuccess = () => {
    router.push("/clients");
  };

  // Show loading state to prevent hydration mismatch
  if (isLoading) {
    return (
      <Box>
        <Header
          title="Editar Cliente"
          description="Edite as informações do cliente selecionado."
        />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Header
        title="Editar Cliente"
        description="Edite as informações do cliente selecionado."
      />
      <ClientForm mode="edit" client={id} onSuccess={handleSuccess} />
    </Box>
  );
};

export default ClientIdPage;
